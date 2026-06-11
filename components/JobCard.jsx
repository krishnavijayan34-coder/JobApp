import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box
} from '@mui/material';

function JobCard({
  title,
  company,
  location,
  salary,
  type,
  onApply,
  applied,
  onSave
}) {
  return (
    <Card elevation={2} sx={{ borderRadius:3 }}>
      <CardContent>

        <Box
          sx={{
            display:'flex',
            justifyContent:'space-between',
            mb:1
          }}
        >
          <Typography fontWeight="bold" fontSize="15px">
            {title}
          </Typography>


          <Chip
            label={type}
            size="small"
            sx={{
              background:'#eff6ff',
              color:'#2563eb'
            }}
          />
        </Box>

        <Typography color="#6b7280" fontSize="13px">
          🏢 {company}
        </Typography>

        <Typography color="#6b7280" fontSize="13px">
          📍 {location}
        </Typography>

        <Typography color="#6b7280" fontSize="13px">
          💰 {salary}
        </Typography>

        <Typography
          color="#10b981"
          fontSize="12px"
          mt={0.5}
        >
        
        </Typography>

        <Button
          fullWidth
          variant={applied ? 'outlined' : 'contained'}
          size="small"
          onClick={onApply}
          disabled={applied}
          sx={{
            mt:2,
            textTransform:'none',
            background: applied ? 'transparent' : '#2563eb',
            color: applied ? '#2563eb' : 'white'
          }}
        >
          {applied ? 'Applied ✓' : 'Apply Now'}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={onSave}
          sx={{ mt:1, textTransform:'none' }}
        >
          Save Job
        </Button>

      </CardContent>
    </Card>
  );
}

export default JobCard;