<template>
  <v-dialog width="350" persistent v-model="editDialog">
    <v-btn slot="activator" fab >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>Edit Conference</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <v-card-text>
                <v-text-field
                  name="title"
                  v-model="editedTitle"
                  label="Title"
                  id="title"
                  required>
                </v-text-field>
                <v-menu
                  ref="menu"
                  :close-on-content-click="false"
                  v-model="menu"
                  :nudge-right="40"
                  :return-value.sync="editedDate"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="editedDate"
                    label="Conference Date"
                    prepend-icon="event"
                    readonly
                    required
                  ></v-text-field>
                  <v-date-picker v-model="editedDate" @input="$refs.menu.save(editedDate)"></v-date-picker>

                </v-menu>
              </v-card-text>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn flat color="blue" @click="onAcceptChanges">Accept</v-btn>
              <v-btn flat color="blue" @click="editDialog=false">Close</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>


<script>
  export default {
    props: ['conference'],
    data(){
      return {
        menu: false,
        editDialog: false,
        editedTitle: this.conference.title,
        editedDescription: this.conference.description,
        editedDate: this.conference.date
      }
    },
    methods:{
      onAcceptChanges(){
        if(this.editedTitle.trim() === '' || this.editedDescription.trim() === '' || this.editedDate === '')
          return
        this.editDialog = false
        this.$store.dispatch('updateConferenceData', {
          id: this.conference.id,
          title: this.editedTitle,
          description: this.editedDescription,
          date: this.editedDate
        })
        console.log('Save and close dialog here...')
      }
    }
  }
</script>
