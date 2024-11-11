export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['petSell', 'petAdoption'];

const thisYear = new Date().getFullYear();

export const petYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	petYears.push(String(i));
}

export const petWeight = [0, 1, 1.5, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 11];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
	error6: 'You cant write review for yourself',
};

export const topPetRank = 3;
