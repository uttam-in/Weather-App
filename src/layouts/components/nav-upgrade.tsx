import type { StackProps } from '@mui/material/Stack';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha as hexAlpha } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

import { Label } from 'src/components/label';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const { user } = useMockedUser();

  return (
    <Stack sx={{ px: 2, py: 5, textAlign: 'center', ...sx }} {...other}>
      <Stack alignItems="center">
        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ color: 'var(--layout-nav-text-primary-color)' }}
          >
            Uttam Kumar Panasala
          </Typography>

            <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-primary-color)' }}
            >
             <b> Product Manager Accelerator</b><br />
            From entry-level to VP of Product, we<br /> support PM professionals through<br /> every stage of their careers.
            </Typography>
            <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => window.open('https://www.linkedin.com/school/pmaccelerator/', '_blank')}
            >
            Info
            </Button>
        </Stack>


      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }: StackProps) {
  return (
    <Stack
      sx={{
        ...bgGradient({
          color: `135deg, ${hexAlpha('#F7BB95', 0.92)}, ${hexAlpha('#5B2FF3', 0.92)}`,
          imgUrl: `${CONFIG.assetsDir}/assets/background/background-7.webp`,
        }),
        px: 3,
        py: 4,
        borderRadius: 2,
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: (theme) => `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      />

      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{ right: 0, width: 112, height: 112, position: 'absolute' }}
      />

      <Stack alignItems="flex-start" sx={{ position: 'relative' }}>
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          35% OFF
        </Box>

        <Box
          component="span"
          sx={{ mb: 2, mt: 0.5, color: 'common.white', typography: 'subtitle2' }}
        >
          Power up Productivity!
        </Box>

        <Button variant="contained" size="small" color="warning">
          Upgrade to Pro
        </Button>
      </Stack>
    </Stack>
  );
}
