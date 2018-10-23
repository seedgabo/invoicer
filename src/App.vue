<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile :to="item.to" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/login">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cerrar Session</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app v-if="api.user">
      <v-toolbar-side-icon @click="drawer=!drawer"></v-toolbar-side-icon>
      <img style="height:45px;" src="@/assets/logo.png" alt="">
      <v-toolbar-title>
        <img style="width:50%;" src="@/assets/infographic.png" alt="">
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <div :class="{'backgound': !api.user}">
        <div class="opaquer">
          <router-view />
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
export default {
	mounted() {},
	data() {
		return {
			drawer: false,
			items: [
				{
					icon: "bar_chart",
					title: "Dashboard"
				}
			],
			title: "Facturador"
		};
	},
	name: "App"
};
</script>
<style lang="sass">
.backgound
  height: 100%
  background-image: url("https://facturacion.eycproveedores.com/img/fondo%20(1).jpg");
  .opaquer
    height: 100%
    background-color: rgba(120,120,120,.5)

</style>
