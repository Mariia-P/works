const unitsJson =
    '[{"measure":"m","coefficient":1},{"measure":"cm","coefficient":0.01},{"measure":"in","coefficient": 0.0254},{"measure": "ft","coefficient": 0.3048}]';

const units = JSON.parse(unitsJson);

class Converter {
    constructor(units) {
        this.units = units;
        this.props = [];
        this.measures = [];
        this.number = [0];
    }
    // функция для возврата массива значений свойства measure в массиве объектов units
    getArrayMeasure() {
        this.measures = [];
        const that = this;
        this.units.forEach(function (unit) {
            this.measures.push(unit.measure);
        }, that);
    }


    convertToSelectedValue() {
        this._dropDown();
        

        let count = document.getElementById('number1');
        let myMeasure = document.getElementById('sel1');
        let needMeasure = document.getElementById('sel2');

        const needArray =[];
       
        const form = document.querySelector('form');
        const output = document.querySelector('output'); 
        
        let firstUnit; 
        let secondUnit; 
        let result;
        
        

        form.addEventListener('submit', e => {
            e.preventDefault();
            for(const element of e.target.elements){
            if (element.tagName === 'BUTTON') {
                needArray[0]=myMeasure.value;
                needArray[1]=needMeasure.value;
                this.number[0] = +count.value;
                
                firstUnit = this.units.filter(function (unit) {
                    return unit.measure === needArray[0];
                });
                secondUnit = this.units.filter(function (unit) {
                    return unit.measure === needArray[1];
                });
               
                 result = (
                        (this.number[0] * firstUnit[0].coefficient) /
                        secondUnit[0].coefficient
                    ).toFixed(2);
    
                output.textContent =  result;

            }
        }
             

        });
        this._addNewUnit();
      
    }

    // функция для добавления в базу данных units новой единицы измерения, и его коэффициента
    // который равен доле этой единицы относительно одного метра
    _addNewUnit() {

        const form= document.getElementById('wrapperForm');
        const inputMeasure= document.getElementById('inputMeasure');
        const inputcoefficient= document.getElementById('inputCoefficient');
        
        const newUnit = {};
        form.addEventListener('submit', e => {
            e.preventDefault();
            for(const element of e.target.elements){
                if (element.tagName === 'BUTTON') {
                    newUnit.measure=inputMeasure.value;
                    newUnit.coefficient=inputcoefficient.value;
                    this.units.push(newUnit);
                    const dropdown1 = document.getElementById('sel1');
                    dropdown1.options[dropdown1.options.length] = new Option (newUnit.measure);
                    const dropdown2 = document.getElementById('sel2');
                    dropdown2.options[dropdown2.options.length] = new Option (newUnit.measure);
                }
            }
            
        });
    
    
    }

    _dropDown() {
        this.getArrayMeasure();
        const dropdown1 = document.getElementById('sel1');
        const dropdown2 = document.getElementById('sel2');

        for (let i = 0; i < this.measures.length; ++i) {
            // Append the element to the end of Array list
            dropdown1[dropdown1.length] = new Option(
                this.measures[i],
                this.measures[i]
            );
            dropdown2[dropdown2.length] = new Option(
                this.measures[i],
                this.measures[i]
            );
        }
    }
}



const myConverter = new Converter(units);
myConverter.convertToSelectedValue();

