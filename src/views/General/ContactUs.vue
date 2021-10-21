<template>
<br><br>
<NavBarGeneral/>
<br>
    <div id="bg">
        <div id="textPosition">
            <h1>Contact Us</h1>
            <p>Do let us know of any queries/concerns/feedback you might have.<br>
                Our team value your opinions and will get back to you as soon as possible!
            </p>
            <div id="wrapper">
                <div id="contact-form">
                    <form ref="form" @submit.prevent="sendEmail">
                        <label>Name</label>
                        <input type="text" name="user_name" placeholder="Your Name">
                        <label>Email</label>
                        <input type="email" name="user_email" placeholder="Your Email">
                        <label>Message</label>
                        <textarea name="message" cols="30" rows="4" required=""
                            placeholder="Your Message"></textarea>
                        <input type="submit" value="Send">
                    </form> 
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import NavBarGeneral from "@/components/NavBarGeneral.vue"
import emailjs from 'emailjs-com';

export default {
    components: {NavBarGeneral},
    name:"ContactUs",

    methods: {
        async sendEmail() {
            await emailjs.sendForm('service_mhmbt3103', 'contact_form', this.$refs.form, 'user_vWHnt7ugddg9JbFay7C0Z')
                .then((result) => {
                    console.log('SUCCESS!', result.text);
                    alert("Contact Form Successfully Submitted!");
                }, (error) => {
                    console.log('FAILED...', error.text);
                    alert("Contact Form Submission Failed!");
                });
        }
    }
}
</script>

<style scoped>
#bg{
    position: relative;
    width: 100%;
    height: 720px;
    background-size: cover;
    /* background-image: url("~@/assets/aboutUs.png"); */
    background-repeat: no-repeat;
    background-position: center center;
    text-align: center;
    margin:auto;
    padding: 0;
}
#textPosition{
    text-align: center;
    padding: 30px;
}
form{
    margin: 20px;
}
label{
    float:left;
}
#wrapper{
    display: flex;
    align-items: center;
    flex-direction: column; 
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 20px;
    border-radius: 5px;
}
#contact-form{
    -webkit-border-radius: 10px 10px 10px 10px;
    border-radius: 10px 10px 10px 10px;
    background: #fff;
    padding: 30px;
    width: 90%;
    max-width: 550px;
    position: relative;
    padding: 0px;
    -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
    box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
    text-align: center;
}
input[type=text], [type=email], textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
}
input[type=submit] {
    background-color: #56baed;
    border: none;
    color: white;
    padding: 15px 80px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    text-transform: uppercase;
    font-size: 13px;
    -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
    box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
    margin: 5px 20px 40px 20px;
}
input[type=submit]:hover {
    background-color: #39ace7;
}
</style>