<template>
  <div v-if="user" id="bgBlock">
    <br />
    <div id="innerBlock">
      <label for="articleTitle">Title: </label>
      <input
        v-model="title"
        id="articleTitle"
        maxlength="24"
        class="input input-sm input-primary input-bordered "
        placeholder="Input the title of your article (Max characters: 24)"
      />
      <br /><br />
      <label>Category: </label>
      <input
        type="checkbox"
        id="generalCat"
        value="General"
        v-model="category"
      />
      <label for="generalCat">Stress </label>
      <input type="checkbox" id="careerCat" value="Career" v-model="category" />
      <label for="careerCat">Career </label>
      <input
        type="checkbox"
        id="RelationshipCat"
        value="Relationship"
        v-model="category"
      />
      <label for="relationshipCat">Relationship </label>
      <input type="checkbox" id="OthersCat" value="Others" v-model="category" />
      <label for="othersCat">Others </label>
      <br /><br /><br />
      <div id="imagePosition">
        <label id="sameLine" for="formFile">Choose Article Image:</label>
        <input
          class="form-control"
          ref="fileInput"
          type="file"
          @input="preview"
        />
        <div
          v-if="this.previewImage != null"
          class="imagePreviewWrapper"
          :style="{ 'background-image': `url(${previewImage})` }"
          @click="selectImage"
        ></div>
      </div>
      <br /><br />
      <QuillEditor
        v-model:content="quillContent"
        contentType="html"
        placeholder="Enter article here"
        theme="snow"
        :style="{ 'background-color': '#faf7f5' }"
      />
    </div>
    <br />
    <button v-on:click="postArticle()" id="post" class="btn btn-primary">
      Post Article
    </button>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
  name: "AddArticle",
  components: { QuillEditor },
  data() {
    return {
      user: false,
      quillContent: "",
      title: "",
      fbuser: "",
      picture: "",
      category: [],
      previewImage: null,
      imageData: null,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
    this.fbuser = auth.currentUser.uid;
  },

  methods: {
    async postArticle() {
      //find counsellor name:
      let docRef = doc(db, "Counsellors", this.fbuser);
      let counsellorDoc = await getDoc(docRef);
      if (
        this.title == "" ||
        this.quillContent == "" ||
        this.imageData == null
      ) {
        alert("You have to fill up all fields to post an article.");
      } else {
        if (confirm("Confirm to post this article?")) {
          //concatenate category types
          let finalCategory = "";
          if (this.category.length == 2) {
            finalCategory = this.category[0] + ", " + this.category[1];
          } else if (this.category.length == 3) {
            finalCategory =
              this.category[0] +
              ", " +
              this.category[1] +
              ", " +
              this.category[2];
          } else {
            finalCategory = this.category[0];
          }

          //add to Counsellor's doc
          await updateDoc(doc(db, "Counsellors", this.fbuser), {
            my_articles: arrayUnion(this.title),
          });

          //create new Article
          await setDoc(doc(db, "HelpResources", this.title), {
            text: this.quillContent,
            post_date: Timestamp.now()
              .toDate()
              .toLocaleDateString(),
            counsellor_name: counsellorDoc.data().name,
            picture: this.picture,
            category: finalCategory,
          });

          console.log("upload image");
          const picRef = ref(storage, "articlePic");
          let storageRef = ref(picRef, `${this.title}`);

          let snapshot = await uploadBytes(storageRef, this.imageData);
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          let url = await getDownloadURL(storageRef);
          const docRef = doc(db, "HelpResources", this.title);
          updateDoc(docRef, {
            picture: url.toString(),
          })
            .then(
              alert(
                "Article uploaded successfully! Please wait a few seconds for the page to reload."
              ),
              await new Promise((resolve) => setTimeout(resolve, 800))
            )
            .catch((e) => {
              console.log(e);
            });

          window.location.reload();
        }
      }
    },

    selectImage() {
      this.$refs.fileInput.click();
    },

    preview() {
      console.log("preview");
      let input = this.$refs.fileInput;
      let file = input.files;
      this.imageData = event.target.files[0];
      console.log("preview3");
      if (file && file[0]) {
        console.log("preview4");
        let reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
          console.log("preview5");
        };
        console.log("preview6");
        reader.readAsDataURL(file[0]);
        console.log("preview7");
        this.$emit("input", file[0]);
        console.log("preview done");
      }
    },
  },
};
</script>

<style scoped>
#uploadButton {
  float: right;
  margin-top: -20px;
  margin-right: 300px;
}

#articleTitle {
  width: 55%;
  height: 30px;
}

#mainText {
  border-radius: 35px;
  background: rgb(255, 255, 255);
  padding: 20px;
  width: 60%;
  height: 500px;
  font-family: "Roboto", sans-serif;
  margin: auto;
}

#sameLine {
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
  margin-left: 300px;
}

.imagePreviewWrapper {
  background-repeat: no-repeat;
  width: 600px;
  height: 400px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: contain;
  background-position: center center;
  margin-top: 10px;
}
</style>
