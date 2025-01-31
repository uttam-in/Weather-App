'use client';

import type { BoxProps } from '@mui/material/Box';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;
    const SECONDARY_LIGHT = theme.vars.palette.secondary.light;

    /*
    * OR using local (public folder)
    *
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/logo-single.svg`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/logo-full.svg`}
        width="100%"
        height="100%"
      />
    );
    *
    */

    const singleLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sun Background */}
        <circle
          cx="256"
          cy="256"
          r="180"
          fill={`url(#${gradientId}-sun)`}
          opacity="0.2"
        />
        
        {/* Main Cloud */}
        <path
          fill={`url(#${gradientId}-cloud-main)`}
          d="M396 220c0-66.3-53.7-120-120-120-55.2 0-101.7 37.4-115.8 88.3C133.5 183.7 106 208.5 96 240c-30.9 5.3-54 32.2-54 64.1 0 36.1 29.3 65.4 65.4 65.4h304.2c36.1 0 65.4-29.3 65.4-65.4 0-35.4-28.1-64.3-63.2-65.4"
        />

        {/* Small Rain Drops */}
        <path
          fill={`url(#${gradientId}-drops)`}
          d="M200 382l-20 40M260 382l-20 40M320 382l-20 40"
          stroke={PRIMARY_MAIN}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Sun Rays */}
        <path
          fill={`url(#${gradientId}-rays)`}
          d="M256 120V96M256 416v-24M120 256H96M416 256h-24M369.9 369.9l-17-17M159.1 159.1l-17-17M369.9 142.1l-17 17M159.1 352.9l-17 17"
          stroke={PRIMARY_LIGHT}
          strokeWidth="16"
          strokeLinecap="round"
        />

        <defs>
          {/* Sun Gradient */}
          <linearGradient
            id={`${gradientId}-sun`}
            x1="76"
            y1="76"
            x2="436"
            y2="436"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          {/* Cloud Gradient */}
          <linearGradient
            id={`${gradientId}-cloud-main`}
            x1="96"
            y1="100"
            x2="477"
            y2="369.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          {/* Rain Drops Gradient */}
          <linearGradient
            id={`${gradientId}-drops`}
            x1="180"
            y1="382"
            x2="180"
            y2="422"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          {/* Sun Rays Gradient */}
          <linearGradient
            id={`${gradientId}-rays`}
            x1="96"
            y1="96"
            x2="416"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={SECONDARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
      </svg>
    );

    const fullLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Small Logo Version */}
        <g transform="translate(0, -12) scale(0.25)">
          {/* Same as single logo but scaled */}
          <circle
            cx="256"
            cy="256"
            r="180"
            fill={`url(#${gradientId}-sun-full)`}
            opacity="0.2"
          />
          
          <path
            fill={`url(#${gradientId}-cloud-main-full)`}
            d="M396 220c0-66.3-53.7-120-120-120-55.2 0-101.7 37.4-115.8 88.3C133.5 183.7 106 208.5 96 240c-30.9 5.3-54 32.2-54 64.1 0 36.1 29.3 65.4 65.4 65.4h304.2c36.1 0 65.4-29.3 65.4-65.4 0-35.4-28.1-64.3-63.2-65.4"
          />

          <path
            fill={`url(#${gradientId}-drops-full)`}
            d="M200 382l-20 40M260 382l-20 40M320 382l-20 40"
            stroke={PRIMARY_MAIN}
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            fill={`url(#${gradientId}-rays-full)`}
            d="M256 120V96M256 416v-24M120 256H96M416 256h-24M369.9 369.9l-17-17M159.1 159.1l-17-17M369.9 142.1l-17 17M159.1 352.9l-17 17"
            stroke={PRIMARY_LIGHT}
            strokeWidth="16"
            strokeLinecap="round"
          />
        </g>

        {/* Text "WeatherApp" */}
        <text
          x="140"
          y="72"
          fill={TEXT_PRIMARY}
          fontSize="48"
          fontFamily="Arial-Bold, Arial"
          fontWeight="bold"
        >
          WeatherApp
        </text>

        <defs>
          {/* Same gradients as single logo but with -full suffix */}
          <linearGradient
            id={`${gradientId}-sun-full`}
            x1="76"
            y1="76"
            x2="436"
            y2="436"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient
            id={`${gradientId}-cloud-main-full`}
            x1="96"
            y1="100"
            x2="477"
            y2="369.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient
            id={`${gradientId}-drops-full`}
            x1="180"
            y1="382"
            x2="180"
            y2="422"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient
            id={`${gradientId}-rays-full`}
            x1="96"
            y1="96"
            x2="416"
            y2="416"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={SECONDARY_LIGHT} />
            <stop offset="1" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
      </svg>
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
