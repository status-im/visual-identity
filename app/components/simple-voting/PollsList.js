import React, { Fragment, Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import PollManager from 'Embark/contracts/PollManager';
import MiniMeTokenInterface from 'Embark/contracts/MiniMeTokenInterface';
import web3 from "Embark/web3"
import CircularProgress from '@material-ui/core/CircularProgress';
import { VotingContext } from '../../context';

const sortingFn = {
  MOST_VOTES: (a, b) => b._qvResults - a._qvResults,
  MOST_VOTERS: (a, b) => b._voters - a._voters,
  NEWEST_ADDED: (a, b) => b._startBlock - a._startBlock,
  ENDING_SOONEST: (a, b) => a._endBlock - b._endBlock
};
class Poll extends Component {

  constructor(props){
    super(props);
    this.state = { isSubmitting: false };
  }

  handleChange = (event, value) => {
    const { appendToPoll, idPoll } = this.props;
    appendToPoll(idPoll, { value });
  };

  handleClick = (event) => {
    event.preventDefault();

    this.setState({isSubmitting: true});

    const { customVote, poll, unvote } = PollManager.methods;
    const { updatePoll, idPoll, value } = this.props;
    const { toWei } = web3.utils;

    const balance4Voting = toWei(value * value);
    const toSend = balance4Voting == 0 ? unvote(idPoll) : customVote(idPoll, balance4Voting);

    toSend.estimateGas()
          .then(gasEstimated => {
            console.log("voting gas estimated: " + gasEstimated);
            return toSend.send({gas: gasEstimated + 100000});
          })
          .then(res => {
            console.log('sucess:', res);
            this.setState({isSubmitting: false});
            return updatePoll(idPoll);
          })
          .catch(res => {
            console.log('fail:', res);
          })
          .finally(() => {
            this.setState({isSubmitting: false});
          });
  }

  componentDidMount() {
    const { fromWei } = web3.utils;
    const { appendToPoll, idPoll } = this.props;
    MiniMeTokenInterface.options.address = this.props._token;
    MiniMeTokenInterface.methods.balanceOfAt(web3.eth.defaultAccount, this.props._startBlock - 1)
                        .call()
                        .then(balance => {
                          appendToPoll(idPoll, {balance: fromWei(balance)})
                        });

    PollManager.methods.getVote(this.props.idPoll, web3.eth.defaultAccount)
               .call()
               .then(vote => {
                 appendToPoll(idPoll, {value: parseInt(Math.sqrt(fromWei(vote)))})
               })
  }

  render(){
    const {
      _description,
      _totalCensus,
      _voters,
      _qvResults,
      _results,
      _canVote,
      value,
      balance
    } = this.props;
    const { isSubmitting } = this.state;

    const disableVote = balance == 0 || !_canVote || isSubmitting;
    const { fromWei } = web3.utils;
    const maxValue = Math.floor(Math.sqrt(balance));

    return (
      <Card>
        <CardContent>
          <Typography variant="headline">{_description}</Typography>
          <Typography variant="subheading" color="textSecondary">
            Number of voters: {_voters}
          </Typography>
          <Typography variant="subheading" color="textSecondary">
            Votes: {_qvResults}
          </Typography>
          <Typography variant="subheading" color="textSecondary">
            SNT Allocated: {fromWei(_results)}
          </Typography>
        </CardContent>
        <Tooltip id="tooltip-icon" placement="top" title={`${value * value} SNT - ${value} vote credits`}>
          <CardActions>
            <Slider disabled={disableVote} value={value || 0} min={0} max={maxValue} step={1} onChange={this.handleChange} />
            {isSubmitting ? <CircularProgress /> : <Button variant="contained" disabled={disableVote}  color="primary" onClick={this.handleClick}>Vote</Button>}
          </CardActions>
        </Tooltip>
      </Card>
    )
  }
}


const PollsList = () => (
  <VotingContext.Consumer>
  {({ updatePoll, rawPolls, pollOrder, appendToPoll }) =>
    <Fragment>
    {rawPolls
      .map((poll, i) => ({ ...poll, idPoll: i }) )
      .sort(sortingFn[pollOrder])
      .map((poll, idx) => <Poll key={idx} appendToPoll={appendToPoll} updatePoll={updatePoll} {...poll} />)}
    </Fragment>
  }
  </VotingContext.Consumer>
)

export default PollsList
