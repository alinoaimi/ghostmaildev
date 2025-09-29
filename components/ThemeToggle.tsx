'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as SystemModeIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useThemeMode, ThemeMode } from '../contexts/ThemeContext';

const themeOptions = [
  { mode: 'system' as ThemeMode, label: 'System', icon: SystemModeIcon },
  { mode: 'light' as ThemeMode, label: 'Light', icon: LightModeIcon },
  { mode: 'dark' as ThemeMode, label: 'Dark', icon: DarkModeIcon }
];

export default function ThemeToggle() {
  const { mode, setMode, actualTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedMode: ThemeMode) => {
    setMode(selectedMode);
    handleClose();
  };

  // Get the current icon based on actual theme
  const getCurrentIcon = () => {
    if (mode === 'system') return SystemModeIcon;
    return actualTheme === 'dark' ? DarkModeIcon : LightModeIcon;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CurrentIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 140,
              borderRadius: 2,
            }
          }
        }}
      >
        {themeOptions.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = mode === option.mode;
          
          return (
            <MenuItem
              key={option.mode}
              onClick={() => handleSelect(option.mode)}
              sx={{
                px: 2,
                py: 1,
                fontSize: '0.875rem'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <OptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={option.label} />
              {isSelected && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}