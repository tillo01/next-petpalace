import Swal from 'sweetalert2';
import 'animate.css';
import { Messages } from './config';
import 'animate.css';

export const sweetErrorHandling = async (err: any) => {
	await Swal.fire({
		icon: 'error',
		text: err.message,
		showConfirmButton: false,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		position: 'center',
		icon: 'success',
		title: msg.replace('Definer: ', ''),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	await Swal.fire({
		title: msg,
		showClass: {
			popup: 'animate__bounceIn',
		},
		showConfirmButton: false,
		timer: duration,
	}).then();
};

// export const sweetConfirmAlert = (msg: string) => {
// 	return new Promise(async (resolve, reject) => {
// 		await Swal.fire({
// 			icon: 'question',
// 			text: msg,
// 			showClass: {
// 				popup: 'animate__bounceIn',
// 			},
// 			showCancelButton: true,
// 			showConfirmButton: true,
// 			confirmButtonColor: '#7ed957',
// 			cancelButtonColor: '#bdbdbd',
// 		}).then((response) => {
// 			if (response?.isConfirmed) resolve(true);
// 			else resolve(false);
// 		});
// 	});
// };
// Include animations for better pop-up effects

export const sweetConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			title: 'Are you sure?',
			html: `
        <div style="text-align: center;">
          <p style="font-size: 16px; color: #555;">${msg}</p>
        </div>
      `,
			icon: 'warning',
			background: '#fdf9f3',
			backdrop: `
        rgba(0, 0, 0, 0.5)
        url("https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif") // Add animated background
        left top
        no-repeat
      `,
			confirmButtonText: ' Yes',
			cancelButtonText: ' No',
			confirmButtonColor: '#D95757',
			cancelButtonColor: '#999',
			showCancelButton: true,
			showClass: {
				popup: 'animate__animated animate__fadeInDown',
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOutUp',
			},
			customClass: {
				popup: 'custom-popup',
				confirmButton: 'custom-confirm-button',
				cancelButton: 'custom-cancel-button',
			},
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetLoginConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			text: msg,
			showCancelButton: true,
			showConfirmButton: true,
			color: '#212121',
			confirmButtonColor: '#e92C28',
			cancelButtonColor: '#bdbdbd',
			confirmButtonText: 'Login',
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetBasicAlert = async (text: string) => {
	Swal.fire(text);
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = err.message ?? Messages.error1;
	await Swal.fire({
		icon: 'error',
		text: errorMessage,
		showConfirmButton: false,
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
	});

	Toast.fire({
		icon: 'success',
		title: msg,
	}).then((data) => {
		if (enable_forward) {
			window.location.reload();
		}
	});
};
