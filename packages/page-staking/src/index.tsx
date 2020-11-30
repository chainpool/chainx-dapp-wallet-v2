// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';
import type { ElectionStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts, useApi, useFavorites, useCall } from '@polkadot/react-hooks';
import { ValidatorInfo } from './types'
import { isJSON } from './utils'

import basicMd from './md/basic.md';
import Overview from './Overview';

import Query from './Query';
import Summary from './Overview/Summary';

import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import useSortedTargets from './useSortedTargets';

const HIDDEN_ACC = ['actions', 'payout'];


function StakingApp({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts, allAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const targets = useSortedTargets(favorites);
  const validators = useCall<string>(api.rpc.xstaking.getValidators);
  let validatorInfoList: ValidatorInfo[] = JSON.parse(isJSON(validators) ? validators : '[]');

  const stakingOverview = {
    validators: validatorInfoList.map(item => item.account),
    accounts: allAccounts,
    validatorCount: validatorInfoList.filter(item => item.isValidating).length
  }

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Staking overview')
    },

    {
      hasParams: true,
      name: 'query',
      text: t<string>('Validator stats')
    }
  ], []);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? undefined
              : HIDDEN_ACC
          }
          items={items}
        />
      </header>
      <Summary
        isVisible={pathname === basePath}
        next={[]}
        nominators={targets.nominators}
        stakingOverview={stakingOverview}
      />
      <Switch>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query />
        </Route>
      </Switch>

      <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={false}
        next={[]}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)(({ theme }: ThemeProps) => `
  .staking--hidden {
    display: none;
  }

  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    text-align: right;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: ${theme.colorError};
    }
  }
`));
