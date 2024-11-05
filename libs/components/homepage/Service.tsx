import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const Service = () => {
	return (
		<Box sx={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
			<Grid container spacing={3} justifyContent="space-around">
				{/* Feature 1 */}
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
						<LocalShippingIcon fontSize="large" style={{ color: 'green' }} />
						<Typography variant="h6" fontWeight="bold">
							Free Delivery
						</Typography>
						<Typography variant="body2">On orders of $200+</Typography>
					</Box>
				</Grid>

				{/* Feature 2 */}
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
						<CreditCardIcon fontSize="large" style={{ color: 'green' }} />
						<Typography variant="h6" fontWeight="bold">
							COD
						</Typography>
						<Typography variant="body2">Cash on Delivery</Typography>
					</Box>
				</Grid>

				{/* Feature 3 */}
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
						<CardGiftcardIcon fontSize="large" style={{ color: 'green' }} />
						<Typography variant="h6" fontWeight="bold">
							Free Gift Box
						</Typography>
						<Typography variant="body2">Buy a Gift</Typography>
					</Box>
				</Grid>

				{/* Feature 4 */}
				<Grid item xs={12} sm={6} md={3}>
					<Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
						<HeadsetMicIcon fontSize="large" style={{ color: 'green' }} />
						<Typography variant="h6" fontWeight="bold">
							Free Support 24/7
						</Typography>
						<Typography variant="body2">Online 24hrs a Day</Typography>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Service;
