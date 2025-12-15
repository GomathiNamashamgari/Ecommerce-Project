import React from 'react';
import { IconButton, Avatar, Rating, LinearProgress, Grid, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { Review } from '../../../types/ReviewTypes';

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  return (
    <div className="flex justify-between">
      <Grid container spacing={9}>
        <Grid size={1}>
          <Box>
            <Avatar sx={{ width: 56, height: 56, bgcolor: '#9155fd' }}>
              {review.user.fullName.charAt(0)}
            </Avatar>
          </Box>
        </Grid>
        <Grid size={9}>
          <div className="space-y-2">
            <p className="font-semibold">{review.user.fullName}</p>
            <p className="opacity-70">{new Date().toLocaleDateString()}</p>
          </div>
          <Rating readOnly value={review.rating} precision={0.5} />
          <p>{review.reviewText}</p>
          <div className="mt-3 w-full">
            {review.productImages.map((img, index) => (
              <img key={index} className="w-24 h-24 object-cover" src={img} alt="" />
            ))}
          </div>
        </Grid>
      </Grid>
      {onDelete && (
        <IconButton onClick={() => onDelete(review.id)}>
          <Delete sx={{ color: red[700] }} />
        </IconButton>
      )}
    </div>
  );
};

export default ReviewCard;
