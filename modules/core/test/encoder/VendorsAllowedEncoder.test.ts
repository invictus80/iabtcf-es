import {expect} from 'chai';
import {
  VendorsAllowedEncoder,
} from '../../src/encoder';

import {
  TCModel,
  GVL,
} from '../../src';

export function run(): void {

  describe('VendorsAllowedEncoder', (): void => {

    // eslint-disable-next-line
    const vendorlistJson = require('../../dev/vendorlist.json');
    const gvl: GVL = new GVL(vendorlistJson);

    it('should encode into a string', (): void => {

      const tcModel: TCModel = new TCModel(gvl);
      const encoder: VendorsAllowedEncoder = new VendorsAllowedEncoder();
      let encoded = '';

      tcModel.cmpId = 23;
      tcModel.cmpVersion = 1;

      // full consent!
      tcModel.setAll();

      const encodeIt = (): void => {

        encoded = encoder.encode(tcModel);

      };

      expect(tcModel.isValid(), 'input model is valid').to.be.true;

      expect(encodeIt, 'encode should not throw an error').not.to.throw();
      expect(encoded, 'shold not be empty').to.not.equal('');

    });

    it('TCModel->String->TCModel and should be equal', (): void => {

      const tcModel: TCModel = new TCModel(gvl);
      const encoder: VendorsAllowedEncoder = new VendorsAllowedEncoder();
      const decodedModel: TCModel = new TCModel();
      let encoded = '';

      tcModel.cmpId = 23;
      tcModel.cmpVersion = 1;

      tcModel.setAll();

      const strToInt: (str: string) => number = (str: string): number => parseInt(str, 10);
      const allowedVendors: number[] = Object.keys(tcModel.gvl.getVendorsWithConsentPurpose(1)).map(strToInt);

      tcModel.vendorsAllowed.set(allowedVendors);

      const encodeIt = (): void => {

        encoded = encoder.encode(tcModel);

      };
      const decodeIt = (): void => {

        encoder.decode(encoded, decodedModel);

      };

      expect(tcModel.isValid(), 'input model is valid').to.be.true;

      expect(encodeIt).not.to.throw();
      expect(decodeIt).not.to.throw();

      expect(decodedModel.vendorsAllowed.size).to.equal(tcModel.vendorsAllowed.size);

    });

  });

}