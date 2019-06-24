<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="light">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
              label-cols-lg="3"
              label="Novo medicamento"
              label-size="lg"
              label-class="font-weight-bold pt-0"
              class="mb-0"
            >
              <b-form-group
                label-cols-sm="3"
                label="Substância ativa:"
                label-align-sm="right"
                label-for="nested-activeSubs"
              >
                <b-form-input
                  id="nested-activeSubs"
                  required
                  v-model="medicine.activeSubs"></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="3"
                label="Nome:"
                label-align-sm="right"
                label-for="nested-name"
              >
                <b-form-input id="nested-name" 
                  required
                  v-model="medicine.name"></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="3"
                label="Forma farmaceutica:"
                label-align-sm="right"
                label-for="nested-pharmaceuticalForm"
              >
                <b-form-input 
                  id="nested-pharmaceuticalForm" 
                  required
                  v-model="medicine.pharmaceuticalForm"></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="3"
                label="Dosagem (ml/mg):"
                label-align-sm="right"
                label-for="nested-dosage"
              >
                <b-form-input id="nested-dosage" 
                  required
                  type="number"
                  v-model.number="medicine.dosage"></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="3"
                label="Titular:"
                label-align-sm="right"
                label-for="nested-holder"
              >
                <b-form-input id="nested-holder" 
                  required
                  v-model="medicine.holder"></b-form-input>
              </b-form-group>

              <b-form-checkbox
                id="nested-generic"
                v-model="medicine.generic"
                name="nested-generic"
              >Genérico</b-form-checkbox>

              <div v-if="selectedMedicine.length === 1" class="buttons float-right">
                <b-button type="submit" variant="primary">Atualizar</b-button>
                <b-button @click="deleteMedicine(medicine.pk)" variant="danger">Eliminar</b-button>
                <b-button type="reset">Limpar</b-button>
              </div>
              <div v-if="selectedMedicine.length === 0" class="buttons float-right">
                <b-button type="submit" variant="primary">Registar</b-button>
                <b-button type="reset">Limpar</b-button>
              </div>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <ListMedicines 
          :meds="medicines"
          :selected="selectedMedicine"
          @removeSelected="removeMedicine"
          @updateSelected="updateMedicine"
        ></ListMedicines>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ListMedicines from './Medication/ListMedicines'

export default {
  name: 'Medicine',
  components: {
    ListMedicines
  },
  data: () => ({
    medicine: {
      activeSubs: '',
      name: '',
      pharmaceuticalForm: '',
      dosage: 0,
      holder: '',
      generic: false,
      pk: null
    },
    selectedMedicine: [],
    show: true
  }),
  created () {
    this.getMedicines()
  },
  computed: {
    ...mapState({
      medicines: state => state.medicines.medicines
    })
  },
  methods: {
    ...mapActions('medicines', [
      'addMedicine',
      'updateMedicineBO',
      'deleteMedicine',
      'getMedicines'
    ]),
    onSubmit (evt) {
      // cancela o comportamento default do evento
      evt.preventDefault()
      if (this.medicine.pk) {
        this.updateMedicineBO(this.medicine)
      } else {
        this.addMedicine(this.medicine)
      }
      this.medicine = {
        activeSubs: '',
        name: '',
        pharmaceuticalForm: '',
        dosage: '',
        holder: '',
        generic: false,
        pk: null
      }
      this.selectedMedicine = []
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.medicine = {
        activeSubs: '',
        name: '',
        pharmaceuticalForm: '',
        dosage: '',
        holder: '',
        generic: false,
        pk: null
      }
      this.selectedMedicine = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    removeMedicine () {
      this.selectedMedicine = []
      this.medicine = {
        activeSubs: '',
        name: '',
        pharmaceuticalForm: '',
        dosage: '',
        holder: '',
        generic: false,
        pk: null
      }
    },
    updateMedicine (med) {
      this.selectedMedicine = [med]
      this.medicine = med
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  width: 250px;
}

</style>
