import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/production/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Production - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
