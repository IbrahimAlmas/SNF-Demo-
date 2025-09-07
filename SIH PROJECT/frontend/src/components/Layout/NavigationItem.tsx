import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';

interface NavigationItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  text,
  icon,
  path,
  isActive,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
    if (onClick) {
      onClick();
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          borderRadius: 1,
          mx: 1,
          my: 0.5,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? 'white' : 'text.secondary',
            minWidth: 40,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: isActive ? 600 : 400,
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
