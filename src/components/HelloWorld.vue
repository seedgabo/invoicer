<template>
  <v-container fluid>
    <v-layout column align-center>
      <v-progress-linear :indeterminate="true" v-if="loading"></v-progress-linear>
      <v-data-table disable-initial-sort :headers="headers" :items="invoices.data" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{props.item.number}}</td>
          <td>{{props.item.fecha | moment('ll') }}</td>
          <td class="text-xs-center">
            <span v-if="props.item.cliente"> {{props.item.cliente.full_name | truncate(25)}} - <br></span>
            <span v-if="props.item.tercero"> {{props.item.tercero.full_name | truncate(25)}}</span>
          </td>
          <td class="text-xs-center text-capitalize">
            <v-chip small :class="props.item.estado">{{ props.item.estado }}</v-chip>
          </td>
          <td class="text-xs-right">{{props.item.total | currency('$', 0) }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
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
			headers: [
				{
					text: "#",
					align: "left",
					value: "number"
				},
				{
					text: "Fecha",
					align: "left",
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
	background-color: #1867c0;
	color: white;
}
</style>


