<template>
  <v-container fluid>
    <v-layout column align-center>
      <br><br><br><br>
      <v-flex xs12>
        <v-card class="text-xs-center pa-3">
          <img src="@/assets/logo.png" style="height:120px;margin: 0 auto;" alt="">
          <v-card-text>
            <v-text-field :rules="[rules.required, rules.email]" validate-on-blur clear-icon autofocus prepend-icon="person" label="Username" v-model="username"></v-text-field>
            <v-text-field :rules="[rules.required, rules.counter]" validate-on-blur clear-icon prepend-icon="vpn_key" label="password" type="password" v-model="password"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="loading" @click="enter()" :disabled="!canSave" color="primary">Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
	mounted() {
		this.api.user = null;
		this.api.storage.clear();
		axios.defaults.headers.common = {
			"Content-Type": "application/json"
		};
	},
	data() {
		return {
			username: "",
			password: "",
			rules: {
				required: (value) => !!value || "Required.",
				counter: (value) => value.length > 5 || "too short",
				email: (value) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(value) || "Invalid e-mail.";
				}
			},
			loading: false
		};
	},
	methods: {
		enter() {
			this.loading = true;
			this.login(this.username, this.password)
				.then((resp) => {
					this.loading = false;
					this.$router.replace("/");
				})
				.catch((err) => {
					this.loading = false;
					this.showError(err);
				});
		}
	},
	computed: {
		canSave: function() {
			return this.rules.email(this.username) === true && this.rules.counter(this.password) === true;
		}
	}
};
</script>
