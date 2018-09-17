const CarsTable = require('./CarsTable')

class Cars {

  constructor (mailer) {
    this.db = new CarsTable()
    this.mailer = mailer
  }

  add (car) {
    return new Promise((resolve, reject) => {
      const code = car.code ? car.code : car.name.toLowerCase().replace(' ', '')
      this.db.get(code)
        .then(oldcar => {
          if(!oldcar) {
            return this.db.addCar(car)
          }else {
            return { error: false, ...oldcar }
          }
        })
        .then(res => {
          if(res.error) {
            reject(res)
          }else {
            resolve(res)
          }
        });
    });
  }

  edit (id, car) {
    return new Promise((resolve, reject) => {
      try {
        this.db.editCar(id, car)
          .then(res => {
            if(res.error) {
              reject(res);
            }else {
              resolve(res)
            }
          })
          .catch(err => {
            console.error(err);
            reject({ error: err })
          })
      } catch(e) {
        console.error(e);
        reject({ error: e })
      }
    });
  }

  

  getAll () {
    return new Promise((resolve, reject) => {
      this.db.getCars()
        .then(cars => resolve(cars))
        .catch(err => reject({ error: err }))
    })
  }

  get (code) {
    return new Promise((resolve, reject) => {
      console.log('CODE', code)
      this.db.get(code)
        .then(car => {
          resolve(car)
        })
        .catch(err => {
          reject({ error: err })
        })
      })
  }

}

module.exports = Cars
