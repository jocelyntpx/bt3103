 <template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h6>Report Patient</h6>
      <p>Note: Click anywhere outside this pop-up to exit.</p>

      <div id="bg">
        <div id="textPosition">
            <div id="wrapper">
                <div id="contact-form">
                    <form ref="form" @submit.prevent="sendEmail">
                        <input type="hidden" name="reporter" :value="this.counsellor_email">
                        <input type="hidden" name="reportee" :value="this.patient_email">
                        <textarea name="report_details" cols="40" rows="12" required=""
                            placeholder="Report details"></textarea><br><br>
                        <input type="submit" value="Report">
                    </form> 
                </div>
            </div>
        </div>
    </div>

    <div class="close" @click="$emit('close-modal')">
    </div>
  </div>
  </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import emailjs from 'emailjs-com';

export default {
    name:"ReportPatientModal" ,

    props: ['patient_email'],

    data(){
        return{
            user:false,
            fbuser:"", // user's uid 
            counsellor_email: "",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                this.fbuser = user.uid;
                this.counsellor_email = user.email;
            }
            console.log(this.patient_ID)
        })
    },

    methods: {
        async sendEmail() {
            await emailjs.sendForm('service_mhmbt3103', 'report', this.$refs.form, 'user_vWHnt7ugddg9JbFay7C0Z')
                .then((result) => {
                    console.log('SUCCESS!', result.text);
                    alert("Patient Report Successfully Submitted!");
                    this.$emit('close-modal')
                }, (error) => {
                    console.log('FAILED...', error.text);
                    alert("Patient Report Submission Failed!");
                    this.$emit('close-modal')
                });
        }
    }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
  z-index: 1;
}

.modal {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
}

</style>