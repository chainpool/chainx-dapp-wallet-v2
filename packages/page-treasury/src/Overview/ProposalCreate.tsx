// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Propose ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [isOpen, toggleOpen] = useToggle();
  const [value, setValue] = useState<BN | undefined>();
  const hasValue = value?.gtn(0);

  const bondPercentage = useMemo(
    () => `${api.consts.treasury.proposalBond.muln(100).divn(1_000_000).toNumber().toFixed(2)}%`,
    [api]
  );

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Submit treasury proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to submit the proposal from.')}
                  label={t<string>('Submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('This account will make the proposal and be responsible for the bond.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('The account to which the proposed balance will be transferred if approved')}
                  label={t<string>('Beneficiary')}
                  onChange={setBeneficiary}
                  type='allPlus'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The beneficiary will receive the full amount if the proposal passes.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  help={t<string>('The amount that will be allocated from the treasury pot')}
                  isError={!hasValue}
                  label={t<string>('Value')}
                  onChange={setValue}
                />
                <Static
                  help={t<string>('The on-chain percentage for the treasury')}
                  label={t<string>('Proposal Bond')}
                >
                  {bondPercentage}
                </Static>
                <InputBalance
                  defaultValue={api.consts.treasury.proposalBondMinimum.toString()}
                  help={t<string>('The minimum amount that will be bonded')}
                  isDisabled
                  label={t<string>('Minimum Bond')}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The value is the amount that is being asked for and that will be allocated to the beneficiary if the proposal is approved.')}</p>
                <p>{t<string>('Of the beneficiary amount, at least {{bondPercentage}} would need to be put up as collateral. The maximum of this and the minimum bond will be used to secure the proposal, refundable if it passes.', { replace: { bondPercentage } })}</p>
              </Modal.Column>
            </Modal.Columns>
            <article className='warning'>
              <p>{t<string>('Be aware that once submitted the proposal will be put to a council vote. If the proposal is rejected due to a lack of info, invalid requirements or non-benefit to the network as a whole, the full bond posted (as describe above) will be lost.')}</p>
            </article>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || !hasValue}
              label={t<string>('Submit')}
              onStart={toggleOpen}
              params={[value, beneficiary]}
              tx='treasury.proposeSpend'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t<string>('Submit Proposal')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Propose);
