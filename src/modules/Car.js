// @flow

type carModel = {
  code: string,
  name: string,
  description1: Array<string>,
  description2: Array<string>,
  brand: string,
  brandCode: string,
};

const carValidator = {
  code: 'string',
  name: 'string',
  description1: 'descriptionArray',
  description2: 'descriptionArray',
  brand: 'string',
  brandCode: 'string',
};

function isValidString(s: string) {
  return s && s.length > 0;
}

function isValidDescriptionArray(a: Array<string>) {
  if(Array.isArray(a) && a.length > 0) {
    return true;
  }
}

class car {
  
  data: carModel;

  constructor(props: carModel) {
    this.data = props;

  }

  verifyFields() {
    if(!this.data.name || !this.data.brand) {
      return { error: 'noName'}
    }

    this.data.code = this.data.name.toLowerCase().replace(' ', '').replace(/[^a-z]/g,'x');
    this.data.description1 = this.data.description1 || [];
    this.data.description2 = this.data.description2 || [];
    this.data.brandCode  = this.data.brand.toLowerCase().replace(' ', '').replace(/[^a-z]/g,'x');
    return this;
  }

  isValidGeneric(validator: string, data: any) {
    switch(validator) {
    case 'string': 
      return isValidString(data);
    case 'descriptionArray': 
      return isValidDescriptionArray(data);
    default:
      return false;
    }
  }
  /**
   Checks all the data within @data. 
   @returns an object with the query to update dynamo
    in case of error returns an object with an `errors` array and an error flag.
  **/
  generateUpdateQuery () {
    const errors = [];
    let query = 'set',
      values = {},
      index = 0;
    for(let i in carValidator) {
      if(this.isUneditable(i)) { continue; }
      if(!this.data[i]) { continue; }
      if(index++ > 0) { query += ','; }
      let res = this.isValidGeneric(carValidator[i], this.data[i]);

      if(!res) {
        errors.push(i)
      }else {
        query += ` ${i} = :${i}`;
        values[`:${i}`] = this.data[i];
      }
    }
    if(!errors.length) {
      if(query !== 'set') {
        query += `, lastUpdate = :lastUpdate`;
        values[':lastUpdate'] = `${(new Date()).toISOString()}`
      }else {
        errors.push('Invalid attributes')
      }
    }
    return errors.length ? { error: true, errors } : { query, values };
  }
}

module.exports = car;