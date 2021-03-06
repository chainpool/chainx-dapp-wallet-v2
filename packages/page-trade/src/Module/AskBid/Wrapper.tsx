
import styled from 'styled-components';
import SideCard from '../../components/SideCard';
import BaseCell from '../components/BaseCell';
import PriceCell from '../components/PriceCell';
import AmountCell from '../components/AmountCell';

const Wrapper = styled(SideCard)``;

export const TableWrapper = styled.div`
  height: 242px;
  overflow-y: auto;
  display: flex;
  .marbot {
    margin-bottom: 0;
  }
`;

export const SumCell = styled(BaseCell)`
  opacity: 0.72;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 16px;
  width: 40%;
  padding: 0 12px 0 0 !important;
  text-align: right !important;
`;

export const OrderPriceCell = styled(PriceCell)`
  width: 50%;
  opacity: 0.72;
  cursor: pointer;
  padding: 0 0 0 12px !important;
`;

export const OrderAmountCell = styled(AmountCell)`
  width: 50%;
`;

export default Wrapper;
