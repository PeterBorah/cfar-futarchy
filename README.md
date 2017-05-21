# Hanson's Hand

Peter Borah, Nihar Dalal, Jeff Bergen, Alexandra [redacted] Tran

CFAR HackDay May 2017

**Hanson's Hand**
Is an application for implementing **futarchies**.  
It is designed for approachability and ease of use over theoretically optimal economics.  
We encourage its use in Rationalist group houses and experimental seasteads.


### Futarchy summary

Futarchy is a system of governance, invented by economist Robin Hanson, that attempts to solve democracy's failure to aggregate accurate information from an electorate by instead extracting information from prediction markets.  
Constituents "vote on values" — democracy remains in place to fairly determine an electorate's ideal utility function — and "bet on beliefs" — the results of open prediction markets, measured against the chosen utility function, determine policy.  
The consequence of monetary gain or loss incentivizes "experts" to direct the markets, and thus policy and policy effects, towards an "ideal" state.

Futarchic policymaking begins when the nation-state (or any kind of hierarchical decision-making entity) sponsors a nationwide vote to determine the outcome its citizens want to improve.  
This value should be a measure of utility, such as GDP per capita or environmental progress — or a combination of metrics. 

After a utility function is determined, parallel conditional prediction markets are created for each policy believed to improve the metric.  
For example, if the metric chosen by the people is GDP per capita, each policy market would consist of two options — a token in support of the policy and a token in opposition to the policy.  
Those with confidence in their beliefs would purchase the respective token reflecting their beliefs, increasing price of the token in question.  
As participation increases, the resulting price of each token would be a crowdsourced prediction of the decision's effect on GDP per capita.  
In the case that the markets become detached from reality, those more or better informed will have the financial incentive to provide their knowledge in the form of purchasing undervalued tokens, thus driving up the correct token's price and correcting the inconsistency.

Once a predetermined length of time has elapsed, the policy tied to the token with the highest price is selected to be implemented, i.e. determined "lawful" (depending on the policy, enforcement may be left to existing centralized processes).  
The tokens whose policies are not realized will have all their market transactions voided.  
Finally, the eventual impact of the policy implemented (across a fixed length of time) will be used to determine compensation for holders of the remaining valid tokens.

Such a system could be scaled down to the enterprise level to optimize policymaking and provide stockholders and employees with a voice in management.


### Why blockchain?

Prediction markets and futarchy are active interest areas among researchers and developers of blockchain technology — a.k.a. the underlying technology of cryptocurrencies like Bitcoin.  
A blockchain is a distributed ledger that uses a consensus mechanism to validate and canonicalize its transactions among decentralized peers.  
Blockchain technology allows prediction markets to have immutable and unbiased transaction ledgers and oracles, ensuring that payouts and outcome reports are correct, without needing to compensate supposedly trustworthy middlemen and central managers.  
Your trust lies entirely in the code, which is typically open source in order for public participation in consensus.

Hanson's Hand is built on Ethereum, a popular cryptocurrency system like Bitcoin, as well as a platform for developing decentralized applications via writing and running smart contracts.  
Blockchain-based smart contracts are pieces of software that encode, allow users to interact with, and enforce programmatic rules regarding assets and data within a given blockchain.  
They are written in Ethereum's built-in programming language, whose Turing-completeness allows smart contracts to perform any computation — which Bitcoin scripting lacks.  
As you may see, the creation and facilitation of prediction markets can easily be mapped onto Ethereum smart contracts.


### Enterprises and polities

The little futarchy research that has been done heretofore has mostly been regarding its application onto enterprises (mostly blockchain companies) in order to affect decisionmaking that optimizes its profit and its product (e.g. its blockchain system), with research culminating in the ideal of the "futarchic DAO" — or Decentralized Autonomous Organization, typically a blockchain service or company whose governance (method to update protocol and software) is also blockchain-based, rendering the entire company permanently autonomous.

Hanson's Hand, while generalized enough for enterprises to use, aims to bring futarchic governance to on-the-ground political entities — communities of people, typically geographically connected, living under a single political system.  
This ranges from the large — nations, international alliances — to the small — seasteads, communal houses.  
(Seasteads typically operate outside of national jurisdictions. Communal house residents are typically subject to local and national laws — but for our purposes, house "governments" are isolated, powerful, and accessible enough to be a good starting-place for political futarchies.)


### Voting on values

Futarchy's slogan is, famously, "Vote Values, But Bet Beliefs". As [Hanson succinctly clarifies](http://mason.gmu.edu/~rhanson/futarchy.html),

>In futarchy, *democracy would continue to say what we want*, but betting markets would now say how to get it.  
That is, *elected representatives would formally define and manage an after-the-fact measurement of national welfare*, while market speculators would say which policies they expect to raise national welfare.

The emphasis (added) is on his description of "voting on values" — representative democracy, an established and (arguably) successful voting system, remains in its honored seat to determine the utility function that the prediction market outcomes will be measured against — which hints at why only the "betting on beliefs" function of a political futarchy can be realistically implemented on a blockchain.

That is, whereas an enterprise can typically default its utility function to permanently maximize profit or market capitalization, a political entity's utility function needs to heed the values, needs, and desires of each of its living subjects. 	
As values are inarguably abstract and subjective, a political futarchy wants of a fair way to determine the values of those living in its jurisdiction — and *only those*.  
Both constituents and outsiders can have a chance to participate in the prediction markets as many times as they want, since it is only a matter of "betting on beliefs", providing information on probabilities of outcomes *measured against an already-determined utility function*.  
But only constituents should get a vote, *and each an equal vote*, on the utility function which will determine the proposals that affect their everyday lives.

Public blockchains are characteristically decentralized and permissionless, preventing an ability to register and restrict user permission to a particular set of "identities" (consensus specifics include safeguards against DDoS and sybil attacks).  
While blockchain voting platforms are areas for potential innovation, there currently seems to be little value in putting a small democracy on a permissioned blockchain, as most of the blockchain's essence will have been stripped.


### Suggestions to calculate utility function

In most cases, a polity's values will vary so widely across constituents and across situations that a composite utility function is pertinent.  
The most common method is a simple weighted summation of the marginal utilities.  
The composite utility function *U* over two or more relevant objectives, *x*<sub>i</sub>, can be written as

*U*(*x*<sub>0</sub>, *x*<sub>1</sub>, ..., *x*<sub>n</sub>,) = Σ<sup>n</sup><sub>i=0</sub>*w*<sub>i</sub>*x*<sub>i</sub>

where *w*<sub>i</sub> are weights.  
Weights should be considered carefully, with elements such as (1) inherent importance of the objective, (2) counterfactuals, and (3) marginal utility in mind.  
They should also have a limited range, say, 0-10.  

Needless to say, objectives should be measurable (e.g., house profit in dollars or extra food in meals).  
Anti-objectives, metrics one wants to minimize, should be negated.  
Utility should be measured at the time of policy implementation and after the predetermined length of time, to gauge policy effect.  

Since Hanson's Hand displays utility in the 0-100 range, the translated utility *U'* can be written as

*U'* = *U* * 100/(Σ<sup>n</sup><sub>i=0</sub>*Wx*<sub>i</sub>)

where W is the maximum weight.

There should be a separate time periods for (1) submitting objectives, (2) voting on objectives (which can be done through various mechanisms such as ranked voting or quadratic voting), and (3) voting on weights of approved objectives (take the average of each).  
A trusted central authority or third party will need to facilitate the measurements and voting.

### Contract architecture

There are four contracts in use in the system.

1. **Decentralized Autonomous Orgnaization**: allows users to create proposals to get information about the active proposals. 
2. **Proposal**: takes in a proposal description and creates two prediction markets; each one to predict the value of the utility function after a set amount of time if the proposal is implemented or not. After the time elapses the user triggers a check on the average price of the each of the markets and opts to implement the proposal if the positive prediction market has a higher average price than the negative one. In all other cases the policy is not implemented. 
3. **Market**: The proposal contract triggers two market contracts. This is the contract that holds the prediction market and accepts buys and sells of shares in the market. It is also responsible for paying out the investors in the market.
4. **Oracle**: allows users to update the utility function and gives this value to the market contract when requested.

### Rationalist use case

The (Capital-R) Rationalist community and futarchy present each other with relatively unique opportunities.	 
For the Rationalist community, futarchy provides a new possibility for experiments in governance that are closely aligned with Rationalist ideals of objectivity and theoretical elegance.  
For futarchy, the Rationalist community may be the most philosophically aligned group that is not typically known for expertise surrounding blockchain technologies, making them valuable prospects for early adoption and refinement for broader demographics going forward.

Potential applications include:
*	Cohousing - Cohousing is particularly popular among the Rationalist community, and futarchies could be used towards the maximization of resident wellbeing, including minimization of living costs, maximization of incomes, and improvements at accounting for positive and negative externalities created among housemates.
*	Coboating - An analogue to cohousing that offers a more complex set of tradeoffs to take into account. In this case a futarchy could additionally be applied to issues such as evaluating migration plans, weighing preferences for how a group of boats can arrange into a collective raft, and acquisition of additional seaworthy vessels for a private fleet.
*	Charity - Any form of charity with reasonably objective metrics of success could be optimized using futarchy to decide on policies which do more to drive those metrics. This promises to have significant appeal to the Effective Altruism community which has significant overlap with the Rationalist community.
* Leveraging existing resources - A significant portion of the Rationalist community consists of highly-ambitious people willing to take part in extremely experimental ventures for the sake of having a major impact on the world. Futarchy among other methods bears notable promise as one such experiment that is quickly becoming feasible. 
*	Community Management - While the Rationalist community has successfully cultivated many meetups and group houses, a large portion of the community still expresses a lack for a more comprehensive social environment, especially concerning interaction online and surrounding special events. Futarchy is a potential means of optimizing the liveliness of those functions within the Rationalist community, including assessment and implementation of financial incentives where they stand to aid community organization and development of socially shared resources.

