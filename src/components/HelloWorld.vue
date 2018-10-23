<template>
  <v-layout wrap>
    <v-flex sm8 xs12 class="text-xs-left">
      <v-btn color="primary"> Agregar </v-btn>
    </v-flex>
    <v-flex sm4 xs12 class="text-xs-right">
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" hide-details></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-data-table disable-initial-sort :headers="headers" :items="invoices.data" class="elevation-1" :loading="loading" :search="search">
        <v-progress-linear :indeterminate="true" v-if="loading"></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td>{{props.item.number}}</td>
          <td class="text-xs-center">{{props.item.fecha | moment('ll') }}</td>
          <td class="text-xs-center">
            <span v-if="props.item.cliente"> {{props.item.cliente.full_name | truncate(25)}} - <br></span>
            <span v-if="props.item.tercero"> {{props.item.tercero.full_name | truncate(25)}}</span>
          </td>
          <td class="text-xs-center text-capitalize">
            <v-chip small :class="props.item.estado">{{ props.item.estado }}</v-chip>
          </td>
          <td class="text-xs-center">{{props.item.orden_compra }}</td>
          <td class="text-xs-right">{{props.item.taxes | currency('$', 0) }}</td>
          <td class="text-xs-right">{{props.item.total | currency('$', 0) }}</td>
        </template>
        <template slot="pageText" slot-scope="props">
          {{ invoices.from }} - {{ invoices.total }} de {{ invoices.total }}
        </template>
      </v-data-table>

    </v-flex>
  </v-layout>
</template>
<script>
export default {
	mounted() {
		if (this.invoices.data.length == 0) {
			this.getInvoices();
		}
	},
	data() {
		return {
			invoices: { data: [] },
			search: "",
			headers: [
				{
					text: "#",
					align: "left",
					value: "number"
				},
				{
					text: "Fecha",
					align: "center",
					value: "fecha"
				},
				{
					text: "Tercero",
					align: "center",
					value: "tercero.name"
				},
				{
					text: "Estado",
					align: "center",
					value: "estado"
				},
				{
					text: "Orden Compra",
					align: "center",
					value: "orden_compra"
				},
				{
					text: "Imp",
					align: "right",
					value: "taxes"
				},
				{
					text: "Total",
					align: "right",
					value: "total"
				}
			],
			loading: false
		};
	},
	methods: {
		getInvoices() {
			this.loading = true;
			this.get(`invoices?order[created_at]=desc&paginate=150&include=tercero${this.api.user.cliente_id ? "" : ",cliente"}`)
				.then((resp) => {
					this.loading = false;
					console.log(resp.data);
					this.invoices = resp.data;
				})
				.catch((err) => {
					this.showError(err);
				});
		}
	}
};
</script>
<style scoped>
.emitida {
	background-color: #2281ec;
	color: white;
}
</style>


