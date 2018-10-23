<template>
  <v-layout wrap>
    <v-flex sm8 xs12 class="text-xs-left">
      <v-btn @click="newItem()" color="primary"> Agregar </v-btn>
    </v-flex>
    <v-flex sm4 xs12 class="text-xs-right">
      <v-spacer></v-spacer>
      <v-text-field v-model="search"   append-icon="search" label="Search" hide-details></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-data-table :pagination.sync="pagination" :headers="headers" :items="invoices.data" class="elevation-1" :loading="loading" :total-items="invoices.total" :rows-per-page-items="[5,10,25,50,100]">
        <template slot="items" slot-scope="props">
          <tr @click="select(props.item)">
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
          </tr>
        </template>
      </v-data-table>

    </v-flex>

    <v-layout row justify-center>
      <v-dialog fullscreen v-model="dialog" persistent max-width="80%" scrollable>
        <v-card v-if="invoice">
          <v-toolbar color="primary" flat dark>
            <v-toolbar-title>
              Factura #{{invoice.number}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text style="height:90%">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-autocomplete prepend-icon="person" required v-model="invoice.tercero_id" hint='Selecion Tercero' :items="api.objects.terceros" label="Tercero*" item-text="full_name" item-value="id"></v-autocomplete>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field label="Numero*" prepend-icon="fingerprint" v-model="invoice.number" required></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field label="Direccion" prepend-icon="add_location" v-model="invoice.direccion" hint="Calle 26 No 25 50"></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field prepend-icon="shopping_basket" label="Orden Compra" v-model="invoice.orden_compra"></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" :return-value.sync="invoice.fecha" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="invoice.fecha" label="Fecha" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="invoice.fecha" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(invoice.fecha)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md6>
                  <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="invoice.vencimiento" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="invoice.vencimiento" abel="Fecha de Vencimiento de la Factura (Opcional)" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="invoice.vencimiento" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu2.save(invoice.vencimiento)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select prepend-icon="bookmark" label="Estado" v-model="invoice.estado" :items="['anulada','emitida','pagada','vencida','rechazada','anulada']"></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select label="Metodo de pago" prepend-icon="credit_card" v-model="invoice.pago" :items="['efectivo','credito','debito']"></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" depressed @click.native="dialog = false">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-layout>
</template>
<script>
export default {
	async mounted() {
		if (this.$route.query.invoice_id) {
			await this.load(`terceros`);
			this.invoice = (await this.get(`invoices/${this.$route.query.invoice_id}`, "include=terceros")).data;
			this.dialog = true;
		}
	},
	data() {
		return {
			invoices: { data: [], total: 0 },
			search: "",
			invoice: null,
			dialog: false,
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
					value: "tercero_id"
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
					text: "Impuestos",
					align: "right",
					value: "taxes",
          sortable: false
				},
				{
					text: "Total",
					align: "right",
          value: "total",
          sortable: false
				}
      ],
			pagination: {},
			loading: false,
			menu: false,
			menu2: false
		};
	},
	methods: {
		getInvoices() {
      var { sortBy, descending, page, rowsPerPage } = this.pagination;
      if(!sortBy) sortBy = "fecha";
      if(!rowsPerPage) rowsPerPage=10;
      if(!page) page=1;
      var filter = "";
      if(this.search.length >0){
        filter +=`&orWhereLike[number]=${this.search}&orWhereLike[orden_compra]=${this.search}`
      }
      this.loading = true;
			this.get(
				`invoices?page=${page}&order[${sortBy}]=${descending ? "desc" : "asc"}&paginate=${rowsPerPage}&include=tercero${
					this.api.user.cliente_id ? "" : ",cliente"
				}${filter}`
			)
				.then((resp) => {
					this.loading = false;
					console.log(resp.data);
          this.invoices = resp.data;
          this.pagination.totalItems = resp.data.total;
				})
				.catch((err) => {
					this.showError(err);
				});
		},
		async select(inv) {
			await this.load(`terceros`);
			this.invoice = inv;
			this.dialog = true;
		},
		async newItem() {
			await this.load(`terceros`);
			this.invoice = {
				id: null,
				estado: "emitida",
				fecha: new Date(),
				number: "",
				pago: "efectivo",
				orden_compra: ""
			};
			this.dialog = true;
		}
	},
	watch: {
		"$route.query.invoice_id": async function(id) {
			await this.load(`terceros`);
			this.invoice = (await this.get(`invoices/${this.$route.query.invoice_id}`, "include=terceros")).data;
			this.dialog = true;
		},
		pagination: {
			handler() {
				this.getInvoices();
			},
			deep: true
    },
    search(){
      clearTimeout(window.cancelable);
      window.cancelable = setTimeout(()=>{
        this.getInvoices();
      },400);
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


