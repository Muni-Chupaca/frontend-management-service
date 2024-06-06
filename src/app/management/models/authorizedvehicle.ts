export class Authorizedvehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  status: string;
  modality: string;
  circulation: string;
  route: string;
  issueDate: string;
  expirationDate: string;
  fleetNumber: string;
  circulationCard: string;
  ownerName: string;
  documentNumber: string;
  affiliatedCompany: string;

  constructor() {
    this.id = 0;
    this.licensePlate = '';
    this.brand = '';
    this.model = '';
    this.status = '';
    this.modality = '';
    this.circulation = '';
    this.route = '';
    this.issueDate = '';
    this.expirationDate = '';
    this.fleetNumber = '';
    this.circulationCard = '';
    this.ownerName = '';
    this.documentNumber = '';
    this.affiliatedCompany = '';
  }
}
