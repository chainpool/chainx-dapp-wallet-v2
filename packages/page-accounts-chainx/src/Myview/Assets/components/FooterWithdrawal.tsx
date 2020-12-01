import {Button, InputAddress, Modal, TxButton} from '@polkadot/react-components';
import React, {useContext, useState} from 'react';
import {useAccounts, useToggle} from '@polkadot/react-hooks';
import {useAccountAssets} from '@polkadot/react-hooks-chainx';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {KeyringSectionOption} from '@polkadot/ui-keyring/options/types';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';
import LabelHelp from '@polkadot/react-components/LabelHelp';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import styled from 'styled-components';

interface FooterProps {
  allInterests: number | undefined,
  usableInterests: number | undefined
}

const ActionsButton = styled(Modal.Actions)`
  display: flex;
  > button{
    width: 105px;
  }
`

export default function ({allInterests, usableInterests}: FooterProps): React.ReactElement<FooterProps> {
  const {t} = useTranslation();
  const options: KeyringSectionOption[] = [];
  const [isWithDrawButton, toggleWithDrawButton] = useToggle();
  const {allAccounts} = useAccounts();
  const {allAssets} = useAccountAssets(allAccounts);
  const canwithDrawAccounts: string[] = [];
  const {currentAccount} = useContext(AccountContext);
  const [accountId, setAccount] = useState<string | null | undefined>();

  allAssets.map((item) => {
    if (Number(item.XbtcInterests) > 0) {
      canwithDrawAccounts.push(item.account);
    }
  });
  canwithDrawAccounts.map((account) => {
    options.push(
      {
        key: account,
        name: account,
        value: account
      }
    );
  });

  return (
    <div>
      <Button
        icon='plus'
        label={t<string>('Withdraw interest')}
        onClick={toggleWithDrawButton}/>
      {isWithDrawButton && (
        <Modal
          header={t('Withdrawal application of interest')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  defaultValue={currentAccount}
                  help={t<string>('Select the account you wish to submit the tip from.')}
                  label={t('Select the account for withdrawal')}
                  // onChange={setAccount}
                  labelExtra={
                    <span>
                      {t('total interests')}： {allInterests ? allInterests : toPrecision(0, 4)}
                      {/*<LabelHelp help={'111111'}/>*/}
                    </span>
                  }
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <span>
                  {t('avaliable interest')} : {usableInterests ? usableInterests : toPrecision(0, 4)}
                </span>
              </Modal.Column>
              <ActionsButton onCancel={toggleWithDrawButton}>
                <TxButton
                  accountId={accountId}
                  icon='plus'
                  label={t('Withdraw interest')}
                  params={[1]}
                  tx='xMiningAsset.claim'
                />
              </ActionsButton>
            </Modal.Columns>
          </Modal.Content>
        </Modal>)
      }
    </div>
  );
}
