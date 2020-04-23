
function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}

var cityApi = Vue.resource('city/{id}')

Vue.component('cities-form', {
    data: function () {
        return {
            name: '',
            description: '',
            id: ''

        }
    },
    watch: {
        cityAttr: function(newVal, oldVal) {
            this.name = newVal.name;
            this.description = newVal.description;
            this.id = newVal.id;
        }
    },
    props: ['cities', 'cityAttr'],
    template:
        '<form style="width: 40%">\n' +
        '  <div class="form-group">\n' +
        '    <label for="exampleFormControlInput1">City name</label>\n' +
        '    <input type="text" class="form-control" id="exampleFormControlInput1" v-model="name">\n' +
        '  </div>\n' +
        '  <div class="form-group">\n' +
        '    <label for="exampleFormControlTextarea1">Description</label>\n' +
        '    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="description"></textarea>\n' +
        '  </div>\n' +
        '  <div>' +
        '    <input type="button" value="Save" @click="save" />' +
        '  </div>' +
        '</form>',

    methods: {
        save: function () {
            var city = {
                name: this.name,
                description: this.description
            };
            if(this.id){
                cityApi.update({id: this.id}, city).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.cities, data.id);
                        this.cities.splice(index, 1, data);
                        this.name = ''
                        this.id = ''
                        this.description = ''
                    })
                )
            }else {
                cityApi.save({}, city).then(res => res.json().then(data => {
                    this.cities.push(data)
                    this.name = ''
                    this.description = ''
                }))
            }


        }
    }
})

Vue.component('city-row',{
    props: ['city', 'editCity', 'cities'],
    template:
    '<div class="col mb-8">'                                                    +
        '<div class="card" style="width: 18rem;">\n'                            +
        '  <div class="card-body">\n'                                           +
        '    <h5 class="card-title"><i>({{city.id}}) </i>{{city.name}}</h5>\n'  +
        '    <p class="card-text">{{city.description}}</p>\n'                   +
        ' <input type="button" class="btn btn-primary"              '            +
        ' @click="edit" value="Edit"/>'                                         +
        ' <input type="button" class="btn btn-primary"              '            +
        ' @click="del" value="Delete"/>'                                     +
        '  </div>\n'                                                            +
        '</div>'                                                                +
    '</div>',
    methods: {
        edit: function () {
            this.editCity(this.city)
        },
        del: function() {
            cityApi.remove({id: this.city.id}).then(result => {
                if (result.ok) {
                    this.cities.splice(this.cities.indexOf(this.city), 1)
                }
            })
        }

    }
})

Vue.component('cities-list',{
    props:['cities'],
    data: function () {
        return {
            city: null
        }
    },
    template:
            '<div>'                                                                         +
                '   <div>'                                                                  +
                        '<cities-form :cities="cities" :cityAttr="city"/>'                                   +
                    '</div>'                                                                +
                    '<div class="row row-cols-2 row-cols-md-4">'                            +
                        '<city-row v-for="city in cities" :key="city.id" :city="city" :editCity="editCity" :cities="cities"/>'    +
                    '</div>'                                                                +
             '</div>',
    created: function() {
            cityApi.get().then(result =>
                result.json().then(data =>
                    data.forEach(city => this.cities.push(city))
                )
            )

    },
    methods: {
        editCity: function (city) {
            this.city = city
        }
    }
})

var app = new Vue({
    el: '#app',
    template: '<cities-list :cities="cities"/>',
    data: {
        cities:[]
    }
})