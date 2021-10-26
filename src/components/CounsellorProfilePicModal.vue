<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h6>Edit Profile Picture</h6>
      <p>Note: Click anywhere outside this pop-up to exit.</p>

    <div>
        <label for="formFile">Upload Image:</label>
        
        <input class="form-control" ref="fileInput" type="file" @input="preview">
        
        <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
        
        <div>
            <button @click="uploadImage(this.user)">Upload</button>
        </div>
    </div>
    </div>
    <div class="close" @click="$emit('close-modal')">
    </div>
  </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
    name:"CounsellorProfilePicModal" ,

    data(){
        return{
            user:false,
            email:"",
            user_type:"patient",
            fbuser:"",
            previewImage: null,
            imageData:null,
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                if (user.user_type == "counsellor") {
                    this.user_type = "counsellor";
                }
                this.fbuser = user.email;
            }
        })
    },

    methods: {
        selectImage() {
            this.$refs.fileInput.click()
        },

        preview() {
            console.log("preview")
            let input = this.$refs.fileInput
            let file = input.files
            this.imageData = event.target.files[0]
            console.log("preview3")
            if (file && file[0]) {
                console.log("preview4")
                let reader = new FileReader
                reader.onload = e => {
                    this.previewImage = e.target.result
                    console.log("preview5")
            }
            console.log("preview6")
            reader.readAsDataURL(file[0])
            console.log("preview7")
            this.$emit('input', file[0])
            console.log("preview done")
            }
        },

        async uploadImage(user) {
            console.log("upload image")
            const picRef = ref(storage, 'counsellorProfilePic');
            let storageRef=ref(picRef, `${this.user.email}`);

            if (this.imageData!=null) {
                let snapshot = await uploadBytes(storageRef, this.imageData)
                this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                
                let url = await getDownloadURL(storageRef)
                const docRef = doc(db, "Counsellors", user.email);
                updateDoc(docRef, {
                    "profile_pic": url.toString()
                }).then (
                    alert("Profile picture uploaded successfully! Please wait a few seconds for the page to reload."),
                    await new Promise((resolve) => setTimeout(resolve,800)),
                    location.reload(),
                ).catch(e => {
                    console.log(e)
                })
            } else {
                alert("Please select an image.")
            }
            
        },
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
.imagePreviewWrapper {
    background-repeat: no-repeat;
    width: 200px;
    height: 200px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: contain;
    background-position: center center;
    margin-top: 10px;
}
</style>