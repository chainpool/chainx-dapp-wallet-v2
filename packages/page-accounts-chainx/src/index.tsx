// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, {useContext} from 'react';
import { Route, Switch } from 'react-router';
import { useAccounts } from '@polkadot/react-hooks';
import useCounter from './useCounter';
import Myview from './Myview';
import styled from 'styled-components';
import NoAccount from './Myview/NoAccount';
import {AccountContext} from '@polkadot/react-components-chainx/AccountProvider';

export { useCounter };

const Main = styled.main`
  > header{
    margin-bottom: 16px;
  }
  > div{
    // margin:0 16px;
    padding-top: 0;
    width: 100%;
  }
`;

function AccountsApp({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const {currentAccount} = useContext(AccountContext)
  const {hasAccounts} = useAccounts()

  return (
    <Main className='accounts--App'>

      <header>
      </header>
      <Switch>
        <Route>
          {currentAccount || hasAccounts ? <Myview
            basePath={basePath}
            onStatusChange={onStatusChange}
          />: <NoAccount onStatusChange={onStatusChange}/>}
        </Route>
      </Switch>
    </Main>
  );
}

export default React.memo(AccountsApp);
