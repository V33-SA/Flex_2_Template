import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import CallbackView from './CallbackView';

const mapStateToProps = (state) => ({
  AvailableWorker: state['flex'].worker.activity.available
});



export default connect(mapStateToProps)(CallbackView);
