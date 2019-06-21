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

              <b-form-group
                label-cols-sm="3"
                label="Genérico:"
                label-align-sm="right"
                label-for="nested-generic"
              >
                <b-form-input id="nested-generic" 
                  required
                  v-model="medicine.generic"></b-form-input>
              </b-form-group>

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
    <b-row>
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
      generic: '',
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
      'addMedicine', 'updateMedicine', 'deleteMedicine',
      'getMedicines'
    ]),
    onSubmit (evt) {
      // cancela o comportamento default do evento
      evt.preventDefault()
      if (this.medicine.pk) {
        console.log('update', this.medicine)
        this.updateMedicine(this.medicine)
      } else {
        this.addMedicine(this.medicine)
      }
      this.medicine = {
        activeSubs: '',
        name: '',
        pharmaceuticalForm: '',
        dosage: '',
        holder: '',
        generic: '',
        pk: null
      }
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
        generic: '',
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
