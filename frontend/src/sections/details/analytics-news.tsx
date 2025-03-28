import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { DashboardProps } from '../dashboard/post-item';

// ----------------------------------------------------------------------

type Props = CardProps & {
  machine?: string;
  subheader?: string;
  list: DashboardProps[];
};

export function AnalyticsNews({ machine, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader machine={machine} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 405 }}>
        <Box sx={{ minWidth: 640 }}>
          {list.map((post) => (
            <PostItem key={post.serial_number} item={post} />
          ))}
        </Box>
      </Scrollbar>

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function PostItem({ sx, item, ...other }: BoxProps & { item: Props['list'][number] }) {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.machine}
        src={item.machine_img}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={item.machine}
        // secondary={item.description}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
        secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: 'span' }}
      />

      <Box sx={{ flexShrink: 0, color: 'text.disabled', typography: 'caption' }}>
        {fToNow(item.connection)}
      </Box>
    </Box>
  );
}
