//********************* API WEB CONNECTION *********************//
const express = require('express');

const router = express.Router();
const connection = require('../configuration/mysql_db');

// Endpoint สำหรับสร้างข้อมูล กรัม
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch all devices
    const devices = await new Promise((resolve, reject) => {
      connection.execute(`    
        SELECT d.*, mg.group_img
        FROM devices d
        JOIN machine_group mg ON d.group_name = mg.group_name;`, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current timestamp in MySQL format

    const results = await Promise.all(
      devices.map(async (device) => {
        const { machine } = device;

        // Check if there is a production record within the current date and time
        const production = await new Promise((resolve, reject) => {
          connection.execute(
            `SELECT 
              production_id,
              lot_number,
              product_name,
              batch_size,
              start_product,
              finish_product
              FROM production WHERE machine = ? AND ? BETWEEN start_product AND finish_product;`,
            [machine, currentTimestamp],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results[0]);
              }
            }
          );
        });

        if (production) {
          const { start_product, finish_product } = production;

          // Use Promise.all to count the number of results in mode_gram and mode_pcs
          const [mode_gram_count, mode_pcs_count] = await Promise.all([
            new Promise((resolve, reject) => {
              connection.execute(
                `SELECT COUNT(*) AS count FROM mode_gram WHERE machine = ? AND timestamp BETWEEN ? AND ?;`,
                [machine, start_product, finish_product],
                (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results[0].count);
                  }
                }
              );
            }),
            new Promise((resolve, reject) => {
              connection.execute(
                `SELECT COUNT(*) AS count FROM mode_pcs WHERE machine = ? AND timestamp BETWEEN ? AND ?;`,
                [machine, start_product, finish_product],
                (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results[0].count);
                  }
                }
              );
            }),
          ]);

          // Add production and counts information to the device
          return {
            ...device,
            ...production,
            mode_gram_count,
            mode_pcs_count,
          };
        } else {
          return {
            ...device,
            ...production,
            mode_gram_count: 0,
            mode_pcs_count: 0,
          };
        }
      })
    );

    res.status(200).send(results);
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

router.get('/production', (req, res) => {
  const query = `
    SELECT *
    FROM production
    ORDER BY timestamp DESC
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(production Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

router.post('/production/update', (req, res) => {
  const { production_id, machine, lot_number, product_name, batch_size, start_product, finish_product, notes } = req.body;
  console.log(req.body);

  if (production_id) {
    const query = `
      UPDATE production
      SET timestamp = NOW(), machine = ?, lot_number = ?, product_name = ?, batch_size = ?, start_product = ?, finish_product = ?, notes = ?
      WHERE production_id = ?;
    `;

    // const notesTIS620 = iconv.encode(notes, 'tis620');

    const values = [machine, lot_number, product_name, batch_size, start_product, finish_product, notes, production_id];
    connection.execute(query, values, function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(production Create)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('Serial number not found');
      }
    });
  } else {
    const query = `
      INSERT INTO production (timestamp , machine, lot_number, product_name, batch_size, start_product, finish_product, notes)
      VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [machine, lot_number, product_name, batch_size, start_product, finish_product, notes];
    connection.execute(query, values, function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(production Update)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('Serial number not found');
      }
    });
  }
});

router.post('/production/delete', (req, res) => {
  const { production_id } = req.body;

  if (production_id) {
    const query = `
      DELETE FROM production
      WHERE production_id = ?;
    `;

    connection.execute(query, [production_id], function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(production Delete)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('ID not found');
      }
    });
  } else {
    res.status(400).send('ID not found');
  }
});

router.get('/productLists', (req, res) => {
  const query = `
    SELECT *
    FROM products
    GROUP BY product_name ASC
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Product Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

router.post('/details', async (req, res) => {
  const { production_id } = req.body;

  console.log('(Details)=>', 'Production id: ', production_id);

  if (!production_id) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    // สร้าง array ของ Promise
    const productionPromise = new Promise((resolve, reject) => {
      connection.execute(`SELECT * FROM production WHERE production_id = ?;`, [production_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });

    const production = await productionPromise;

    if (!production) {
      return res.status(404).json({ message: 'Production not found' });
    }

    const { machine, start_product, finish_product } = production;

    const modeGramPromise = new Promise((resolve, reject) => {
      connection.execute(
        `SELECT * FROM mode_gram WHERE machine = ? AND timestamp BETWEEN ? AND ?;`,
        [machine, start_product, finish_product],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    const modePcsPromise = new Promise((resolve, reject) => {
      connection.execute(
        `SELECT * FROM mode_pcs WHERE machine = ? AND timestamp BETWEEN ? AND ?;`,
        [machine, start_product, finish_product],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    // ใช้ Promise.all เพื่อรอผลลัพธ์ทั้งหมด
    const [modeGramResults, modePcsResults] = await Promise.all([modeGramPromise, modePcsPromise]);

    // ฟังก์ชันแปลง timestamp ให้เป็นวันที่
    const getDateFromTimestamp = (timestamp) => new Date(timestamp).toISOString().split('T')[0]; // แยกเฉพาะวันที่

    // สร้าง Object สำหรับจัดกลุ่มข้อมูลตามวันที่ และคำนวณผลรวมในแต่ละวัน
    const groupedByDate = (data) => {
      if (!data) return [];

      const groupedData = data.reduce((acc, item) => {
        const date = getDateFromTimestamp(item.timestamp);

        // หากยังไม่เคยมีวันที่นี้ใน Object
        if (!acc[date]) {
          acc[date] = {
            date: date,
            pass_count: 0,
            fail_count: 0,
          };
        }

        // คำนวณผลรวมในแต่ละวัน
        if (item.result === 'PASS') acc[date].pass_count += 1;
        if (item.result === 'FAIL') acc[date].fail_count += 1;

        return acc;
      }, {});

      // แปลง Object เป็น Array
      return Object.values(groupedData);
    };

    function summaryData(data) {
      // คำนวณค่าเฉลี่ยน้ำหนัก
      const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
      // หาค่า timestamp แรกและสุดท้าย (ตรวจสอบค่า timestamp)
      const firstTimestamp = new Date(data[0]?.timestamp || 0); // ถ้าไม่มี timestamp ให้ใช้ 0
      const lastTimestamp = new Date(data[data.length - 1]?.timestamp || 0);

      // คำนวณระยะเวลาในนาทีระหว่าง timestamp แรกและสุดท้าย
      const timeDifferenceInMinutes = (lastTimestamp - firstTimestamp) / (1000 * 60); // แปลงมิลลิวินาทีเป็นนาที

      // คำนวณค่าเฉลี่ยน้ำหนักต่อนาที
      const averageWeightPerMinute = timeDifferenceInMinutes > 0 ? totalWeight / timeDifferenceInMinutes : 0; // ตรวจสอบเพื่อไม่ให้หารด้วย 0

      // นับจำนวน PASS และ FAIL
      const passCount = data.filter((item) => item.result === 'PASS').length;
      const failCount = data.filter((item) => item.result === 'FAIL').length;

      // คำนวณเปอร์เซ็นต์ PASS และ FAIL
      const totalCount = data.length;
      const passPercentage = (passCount / totalCount) * 100;
      const failPercentage = (failCount / totalCount) * 100;

      const summaryDays = groupedByDate(data);

      // แสดงผลลัพธ์
      return {
        data: data,
        average_per_minute: averageWeightPerMinute ? averageWeightPerMinute.toFixed(2) : 0,
        pass_count: passCount ? passCount : 0,
        fail_count: failCount ? failCount : 0,
        pass_percentage: passPercentage ? passPercentage.toFixed(2) : 0,
        fail_percentage: failPercentage ? failPercentage.toFixed(2) : 0,
        summary_days: summaryDays,
      };
    }

    const summaryGramResults = summaryData(modeGramResults);
    const summaryPcsResults = summaryData(modePcsResults);

    // ส่งผลลัพธ์ทั้งหมดกลับไปในรูปแบบ JSON
    res.status(200).json({
      production,
      modeGramData: summaryGramResults,
      modePcsData: summaryPcsResults,
    });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

router.get('/machineLists', (req, res) => {
  const query = `
    SELECT *
    FROM devices
    GROUP BY machine
    ORDER BY machine
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Product Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

module.exports = router;
