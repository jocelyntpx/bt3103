<template>
  <div v-if="fbuser != ''">
    <AlertCounsellorSession :counsellorID="this.fbuser" />
  </div>

  <div v-if="user">
    <br /><br />
    <NavBarCounsellor />
    <br />
    <div style="text-align:center">
      <p class="text-4xl flex justify-center">My Profile</p>
      <br />
      <div class="grid place-items-center">
        <div class="tabs tabs-boxed">
          <div
            data-tip="You are AVAILABLE to take a spontaneous session."
            class="tooltip tooltip-accent tooltip-bottom"
          >
            <button
              @click="toggleCurrentlyAvailable"
              :class="[
                currentlyAvailable ? 'tab tab-md tab-active' : 'tab tab-md',
              ]"
            >
              <strong>Available</strong>
            </button>
          </div>

          <div
            data-tip="You are NOT AVAILABLE to take a spontaneous session."
            class="tooltip tooltip-accent tooltip-bottom"
          >
            <button
              @click="toggleCurrentlyAvailable"
              :class="[
                !currentlyAvailable
                  ? 'tab tab-md tab-red tab-active'
                  : 'tab tab-md',
              ]"
            >
              <strong>Not Available</strong>
            </button>
          </div>
        </div>
      </div>
      <br />

      <div id="bgBlock">
        <div id="col-1">
          <div id="counsellorDetails">
            <div class="card lg:card-side">
              <div class="grid place-items-center">
                <div class="grid grid-flow-col">
                  <div v-if="this.profile_pic" class="avatar">
                    <div
                      class="mb-8 rounded-box w-56 h-56 ring ring-primary ring-offset-base-100 ring-offset-2 mx-2 my-2"
                    >
                      <img :src="this.profile_pic" />
                    </div>
                  </div>

                  <div v-else class="avatar placeholder">
                    <div
                      class="mb-8 bg-neutral-focus text-neutral-content rounded-box w-56 h-56 ring ring-primary ring-offset-base-100 ring-offset-2 mx-2 my-2"
                    >
                      <span class="text-md">No Profile Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-flow-col">
                <div class="card-body">
                  <h2 class="card-title text-2xl">{{ this.name }}</h2>
                  <p>
                    Email: <strong>{{ this.email }}</strong
                    ><br />
                    Gender: <strong>{{ this.gender }}</strong
                    ><br />
                    Specialisations:
                    <strong>{{ this.specialisations_formatted }}</strong
                    ><br />
                    Credentials: <strong>{{ this.credentials }}</strong
                    ><br />
                    Rating: <strong>{{ this.avgRatings }}</strong>
                  </p>
                  <p v-if="this.additional_details">
                    Additional Details:
                    <strong>{{ this.additional_details }}</strong>
                  </p>

                  <div class="-mx-4">
                    <router-link
                      class="btn btn-link"
                      :to="{
                        name: 'CounsellorReviews',
                        params: { id: this.counsellor_ID },
                      }"
                      >View Patients' Reviews</router-link
                    >
                  </div>
                </div>
              </div>
            </div>

            <label for="my-modal-1" class="btn btn-link text-info modal-button "
              >Edit Profile Picture
            </label>
            <input type="checkbox" id="my-modal-1" class="modal-toggle" />
            <div class="modal">
              <div class="modal-box">
                <label for="formFile">Upload Image:</label>
                <input
                  class="form-control"
                  ref="fileInput"
                  type="file"
                  @input="preview"
                />
                <div
                  class="imagePreviewWrapper"
                  :style="{ 'background-image': `url(${previewImage})` }"
                  @click="selectImage"
                ></div>
                <div class="modal-action">
                  <label
                    for="my-modal-1"
                    class="btn btn-secondary"
                    @click="uploadImage(this.user)"
                    >Upload</label
                  >
                  <label for="my-modal-1" class="btn">Close</label>
                </div>
              </div>
            </div>

            <label for="my-modal-2" class="btn btn-link text-info"
              >Edit Profile Details</label
            >
            <input type="checkbox" id="my-modal-2" class="modal-toggle" />
            <div class="modal">
              <div class="modal-box">
                <form>
                  <div id="v-model-multiple-checkboxes">
                    <label for="specialisations"
                      ><strong>Specialisations: </strong></label
                    ><br />
                    <input
                      type="checkbox"
                      id="all_categories"
                      value="All Categories"
                      v-model="this.checkedNames"
                    />
                    <label for="all_categories">All Categories</label>
                    <input
                      type="checkbox"
                      id="general"
                      value="General"
                      v-model="this.checkedNames"
                    />
                    <label for="general">General</label>
                    <input
                      type="checkbox"
                      id="career"
                      value="Career"
                      v-model="this.checkedNames"
                    />
                    <label for="career">Career</label>
                    <input
                      type="checkbox"
                      id="relationships"
                      value="Relationships"
                      v-model="this.checkedNames"
                    />
                    <label for="relationships">Relationships</label>
                    <br />
                  </div>

                  <br />
                  <label for="credentials"><strong>Credentials: </strong></label
                  ><br />
                  <textarea
                    id="credentials"
                    class="textarea h-24 textarea-bordered"
                    cols="60"
                    rows="4"
                    v-model="this.credentials"
                  ></textarea>
                  <br /><br />
                  <label for="add_details"
                    ><strong>Additional Details: </strong></label
                  ><br />
                  <textarea
                    id="add_details"
                    class="textarea h-24 textarea-bordered"
                    cols="60"
                    rows="4"
                    v-model="this.additional_details"
                  ></textarea>
                </form>

                <br />

                <div class="modal-action">
                  <label
                    for="my-modal-2"
                    class="btn btn-secondary"
                    @click="updateDetails(this.checkedNames)"
                    >Update Details</label
                  >
                  <label for="my-modal-2" class="btn">Close</label>
                </div>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div id="col-2" class="bg-base-300 text-base-content">
          <CounsellorCalendar />
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue";
import CounsellorCalendar from "@/components/Counsellor/CounsellorCalendar.vue";
import AlertCounsellorSession from "@/components/Counsellor/AlertCounsellorSession.vue";

import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
  components: { NavBarCounsellor, CounsellorCalendar, AlertCounsellorSession },
  name: "CounsellorProfile",

  data() {
    return {
      user: false,
      email: "",
      user_type: "counsellor",
      counsellor_ID: this.$route.params.id,
      fbuser: "", // counsellor's (user) UID
      currentlyAvailable: null,
      name: "",
      gender: "",
      ratings: [],
      avgRatings: "",
      specialisations_formatted: "",
      credentials: "",
      additional_details: "",
      profile_pic: "",
      previewImage: null,
      imageData: null,
      checkedNames: [],
      specialisations: [],
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        if (user.user_type == "counsellor") {
          this.user_type = "counsellor";
        }
        this.fbuser = user.uid;

        this.getDetails(this.fbuser);
      }
    });
  },

  methods: {
    async getDetails(user) {
      let docRef = doc(db, "Counsellors", String(user));
      let counsellorDoc = await getDoc(docRef);
      this.name = counsellorDoc.data().name;
      this.gender = counsellorDoc.data().gender;
      this.specialisations = counsellorDoc.data().counsellor_specialisations;
      this.ratings = counsellorDoc.data().past_ratings;
      this.profile_pic = counsellorDoc.data().profile_pic;
      this.email = counsellorDoc.data().email;
      this.credentials = counsellorDoc.data().counsellor_credentials;
      this.additional_details = counsellorDoc.data().additional_details;
      this.currentlyAvailable = counsellorDoc.data().currently_available;
      this.checkedNames = this.specialisations;
      this.updateCurrentlyAvailable();

      var avg = 0;
      if (this.ratings.length > 0) {
        var numRatings = this.ratings.length;
        var sum = 0;
        this.ratings.forEach((item) => {
          sum = sum + item;
        });
        avg = sum / numRatings;
      }
      if (avg == 5) {
        this.avgRatings = "★★★★★";
      } else if (avg >= 4) {
        this.avgRatings = "★★★★☆";
      } else if (avg >= 3) {
        this.avgRatings = "★★★☆☆";
      } else if (avg >= 2) {
        this.avgRatings = "★★☆☆☆";
      } else if (avg >= 1) {
        this.avgRatings = "★☆☆☆☆";
      } else {
        this.avgRatings = "☆☆☆☆☆";
      }

      var stringOutput = "";
      if (this.specialisations.length > 0) {
        this.specialisations.forEach((item) => {
          stringOutput = stringOutput + ", " + item;
        });
      }
      this.specialisations_formatted = stringOutput.slice(2);
    },

    async updateCurrentlyAvailable() {
      const counsellorDocRef = doc(db, "Counsellors", this.fbuser);

      //  if counsellor is currently available, check if have upcoming session within <= 1hour, if so, toggle OFF.
      if (this.currentlyAvailable) {
        var upcomingSession = await this.checkExistenceUpcomingSession();
        if (upcomingSession) {
          alert(
            "You have an upcoming session in less than an hour - Setting toggle for 'Currently Available' as Off"
          );
          this.currentlyAvailable = false;
          await updateDoc(counsellorDocRef, { currently_available: false });
        }
      }
    },
    async toggleCurrentlyAvailable() {
      let counsellorDocRef = doc(db, "Counsellors", this.fbuser);

      if (!this.currentlyAvailable) {
        // counsellor can only toggle it ON if he does not have an upcoming session < 1 hour from now.
        let upcomingSession = await this.checkExistenceUpcomingSession();
        console.log(
          "in toggleCurrentlyAvailable, upcomingSession is ",
          upcomingSession
        );
        if (upcomingSession) {
          alert(
            "Unable to turn on toggle - you have an upcoming session in less than an hour."
          );
        } else {
          this.currentlyAvailable = true;
          await updateDoc(counsellorDocRef, { currently_available: true });
        }
      } else {
        this.currentlyAvailable = false;
        await updateDoc(counsellorDocRef, { currently_available: false });
      }
    },

    async checkExistenceUpcomingSession() {
      const counsellorDocRef = doc(db, "Counsellors", this.fbuser);
      const counsellorDocSnap = await getDoc(counsellorDocRef);
      const upcomingSessions = counsellorDocSnap.data()
        .upcoming_counsellor_sessions;

      for (const session of upcomingSessions) {
        let sessionDocRef = doc(db, "Sessions", session);
        let sessionDocSnap = await getDoc(sessionDocRef);
        let sessionTime = sessionDocSnap.data().session_time.toDate();
        let timeNow = Timestamp.now().toDate();

        if (sessionTime - timeNow <= 60 * 60 * 1000) {
          // the difference is in terms of milliseconds.
          return true;
        }
      }
      console.log("no upcoming session - returning false");
      return false;
    },

    selectImage() {
      this.$refs.fileInput.click();
    },

    preview() {
      let input = this.$refs.fileInput;
      let file = input.files;
      this.imageData = event.target.files[0];
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);
      }
    },

    async uploadImage(user) {
      const picRef = ref(storage, "counsellorProfilePic");
      let storageRef = ref(picRef, `${this.user.uid}`);

      if (this.imageData != null) {
        let snapshot = await uploadBytes(storageRef, this.imageData);
        this.uploadValue =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        let url = await getDownloadURL(storageRef);
        const docRef = doc(db, "Counsellors", user.uid);
        updateDoc(docRef, {
          profile_pic: url.toString(),
        })
          .then(
            alert(
              "Profile picture uploaded successfully! Please wait a few seconds for the page to reload."
            ),
            await new Promise((resolve) => setTimeout(resolve, 800)),
            location.reload()
          )
          .catch((e) => {
            console.log(e);
          });
      } else {
        alert("Please select an image.");
      }
    },

    async updateDetails(checkedNames) {
      this.credentials = document.getElementById("credentials").value;
      this.additional_details = document.getElementById("add_details").value;
      let docRef = doc(db, "Counsellors", String(this.fbuser));
      updateDoc(docRef, {
        counsellor_specialisations: checkedNames,
        counsellor_credentials: this.credentials,
        additional_details: this.additional_details,
      })
        .then(
          alert(
            "Profile details updated. Please wait while we refresh your page."
          ),
          await new Promise((resolve) => setTimeout(resolve, 800)),
          location.reload()
        )
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
#profilepic {
  border-radius: 50%;
  margin-top: 10px;
  width: 230px;
  height: 230px;
}
#bgBlock {
  display: flex;
  border-style: solid;
  border-color: #aaa593;
  border-width: 2px;
  background: transparent;
  border-radius: 20px;
  padding: 20px;
  width: 80%;
  height: auto;
  margin: auto;
}

#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}
#col-2 {
  flex: 1;
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
.tab-red {
  background-color: rgb(232, 115, 158);
}
</style>
