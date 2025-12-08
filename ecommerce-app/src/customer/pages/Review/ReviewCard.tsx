import { Delete } from '@mui/icons-material';
import { Avatar, Box, IconButton, Rating,LinearProgress} from '@mui/material';
import { Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react';

const ReviewCard = () => {
  return (
    <div className='flex justify-between '>
      <Grid container spacing={9}  >  
        <Grid size={{xs: 1}}>
          <Box>
            <Avatar className='text-white' sx={{ width: 56, height: 56, bgcolor: '#9155fd' }}>
              C
            </Avatar>
          </Box>
        </Grid>
        <Grid size={{xs:9}}>
            <div className='space-y-2'>
                <div>
                    <p className='font-semibold'>chikki</p>
                    <p className='opacity-70 '>2025-09-27T23:16:07.478333</p>
                </div>
            </div>
            <Rating 
            readOnly
            value={4.5}
            precision={.5}
            />
            <p>value for money, great Product </p>
            

            <div className='mt-3 w-full '>
                <img className='w-24 h-24 object-cover' 
                src="https://m.media-amazon.com/images/I/61D4DuCSWbL._AC_FMavif_UC231,231_CACC,231,231_QL58_.jpg?aicid=community-reviews" alt="" />
            </div>
            <div className='mt-8 max-w-sm '>
              {[
                { label: 'Excellent', value: 80, color: '#4caf50' },
                { label: 'Very Good', value: 15, color: '#8bc34a' },
                { label: 'Good', value: 3, color: '#ffc107' },
                { label: 'Average', value: 1, color: '#ff9800' },
                { label: 'Poor', value: 1, color: '#f44336' },
              ].map((item) => (
                <div key={item.label} className='flex items-center mb-3'>
                  <p className='w-24 text-sm'>{item.label}</p>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      width:'300px',
                      flex: 1,
                      mx: 2,
                      height: 10,
                      borderRadius: 4,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': { bgcolor: item.color },
                    }}
                  />
                  <p className='text-sm text-gray-600 w-12 text-right'>{item.value}%</p>
                </div>
              ))}
              </div>
            
        </Grid>
     </Grid>


        <div>
            <IconButton>
                <Delete sx={{color:red[700]}}/>
            </IconButton>
        </div>


      
    </div>
  );
};

export default ReviewCard;