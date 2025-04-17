import emailjs from '@emailjs/browser';

export const sendEmail = (formRefCurrent: HTMLFormElement) => {

  const SERVICE_ID = 'service_4wvpnme';
  const TEMPLATE_ID = 'pin_verification';
  const PUBLIC_KEY = 'Iabws3hi4xgcq4znS';

  emailjs
    .sendForm(SERVICE_ID, TEMPLATE_ID, formRefCurrent, PUBLIC_KEY)
    .then(
      (res) => {
        // console.log('SUCCESS! \n', res);
      },
      (error) => {
        // console.log('FAILED AGAIN... \n', error);
      },
    );
};
