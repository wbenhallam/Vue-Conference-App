<template>
  <v-container fluid>

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <h2>Suggest a new conference</h2>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <form @submit.prevent="onAddConference">
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                name="title"
                label="Title"
                id="title"
                v-model="title"
                required>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                  name="location"
                  label="Location"
                  id="location"
                  v-model="location"
                  required>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="fileInput"
                  accept="image/*"
                  @change="onFilePicked"
                >
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <img :src="imageUrl" height="200">
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="date"
                    label="Conference Date"
                    required
                  ></v-text-field>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-text-field
                  name="description"
                  label="Description"
                  id="description"
                  v-model="description"
                  multi-line
                  required
                  >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 sm6 offset-sm3>
                <v-btn class="primary darken-3"
                       :disabled="!formIsValid"
                       type="submit"
                >Add Conference</v-btn>
              </v-flex>
            </v-layout>
          </form>
        </v-flex>
      </v-layout>

  </v-container>
</template>


<script>

  export default {
    data () {
      return {
        title: '',
        location: '',
        imageUrl: '',
        description: '',
        date: '',
        modal: false,
        image: null
      }
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
          this.location !== '' &&
          this.imageUrl !== '' &&
          this.description !== '' &&
          this.date !== ''
      }
    },
    methods: {
      onAddConference (){
        if(!this.image)
          return
        const confData = {
          title: this.title,
          location: this.location,
          image: this.image,
          description: this.description,
          date: this.date
        }
        this.$store.dispatch("addConference", confData)
        this.$router.push('/conferences/list')
      },
      onPickFile(){
        this.$refs.fileInput.click();
      },
      onFilePicked(event){
        const files = event.target.files;
        let filename = files[0].name
        if(filename.lastIndexOf('.') <= 0){
          return alert('Please add a valid image')
        }

        // convert file to string
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]

      }
    }
  }

</script>
