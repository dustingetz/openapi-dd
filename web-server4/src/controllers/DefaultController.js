const Controller = require('./Controller');

class DefaultController {
  constructor(Service) {
    this.service = Service;
  }

  async addPet(request, response) {
    await Controller.handleRequest(request, response, this.service.addPet);
  }

  async deletePet(request, response) {
    await Controller.handleRequest(request, response, this.service.deletePet);
  }

  async findPetById(request, response) {
    await Controller.handleRequest(request, response, this.service.findPetById);
  }

  async findPets(request, response) {
    await Controller.handleRequest(request, response, this.service.findPets);
  }

}

module.exports = DefaultController;
