export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['petSell', 'petAdoption'];

const thisYear = new Date().getFullYear();

export const petYears: any = [];

for (let i = 1990; i <= thisYear; i++) {
	petYears.push(String(i));
}

export const petWeight = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
	error6: 'You cant write review for yourself',
};

export const topPetRank = 3;
