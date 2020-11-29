// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Tabs } from '@polkadot/react-components';
import AccountSelect from '@polkadot/react-components-chainx/AccountSelect';

import { Route, Switch } from 'react-router';
import Wrapper from './Wrapper';
import Trade from './Module';
import Orders from './Orders';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';

function TradeApp({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const [nodeName, setNodeName] = useState<string>('');
  const { currentAccount } = useContext(AccountContext);

  useEffect(() => {
    setNodeName(allAccounts[allAccounts.length - 1]);
  }, [allAccounts]);

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t('Currency trade')
    }
  ]);

  return (
    <Wrapper>
      <header>
        <>
          <Tabs
            basePath={basePath}
            items={itemsRef.current}
          />
          <AccountSelect />
        </>
      </header>
      <Switch>
        <Route path={`${basePath}/`}>
          <Wrapper>
            <Trade nodeName={currentAccount}
              setNodeName={setNodeName} />
            <Orders nodeName={currentAccount} />
          </Wrapper>
        </Route>
      </Switch>
    </Wrapper>
  );
}

export default React.memo(TradeApp);
