## What is the GMF Taxonomy?

The Goals, Methods, and Failures (GMF) taxonomy is a failure 
cause analysis taxonomy for AI systems in the real world, interrelating the goals of the system 
deployment, the system's methods, and likely technical causal factors for the observed failure events.
The taxonomy structure encourages considering what is known or observed versus what is potential or likely, guiding how to apply and interpret expert technical knowledge about AI failures.  Further, the proposed annotation workflow features grounding labels to data and external evidence, enhancing verifiability, collaborative annotation and crowdsourcing. These design decisions render GMF a valuable tool for annotating noisy, low-information documents like public AI incident reports.

Details on the taxonomy description, proposed annotation process
and future work are available in our [SafeAI 2023 workshop paper](https://ceur-ws.org/Vol-3381/17.pdf), while
a short description is provided below. 

### GMF Motivation and Structure
The GMF taxonomy was developed to address the following use cases and questions:

- **Linking harms to system goals**: How can developers and deployers of AI systems discover technical failure causes
of **harm related to the system task**, that the AI is deployed to perform in the real world?

- **Connecting technical approaches to failure causes**: How can AI developers and auditors discover **technical causal factors of harm**
that may be linked to implementation methods, model architectures and techniques
employed in their system, such that they may be corrected or avoided?

- **Harness interdisciplinary technical expertise**: How can we **leverage the body of expert technical knowledge** from the Machine
 Learning, AI Safety, Engineering, etc. community, to produce useful, high-quality annotations on **publicly available AI incident reports**, which may lack details and technical information?

- **Data-driven, grounded labelling**: How can we generate annotations **grounded to real-world data** for high-level accuracy,
verifiability and increased potential for further research and development?

<!-- #### Structure -->
The taxonomy is designed to address these questions via a structure of three interrelated
 ontologies, each describing the AI system involved in a publicly available incident report under a different lens.
 These ontologies include system views focused on:

- **AI System Goals**, which characterize high-level goals, objectives and tasks of AI system deployments in the real world (e.g. `Face Recognition`)
- **AI Methods and Technologies**, which describe AI implementation methodologies (e.g. `Transformer`)
- **AI failure causes**, containing technical reasons for systemic failure that results in the observed harm (e.g. `Concept Drift`)

Given that AI incident reports in the news media often lack technical details, GMF annotations are paired with:

- **Confidence modifiers** (`known` and `potential`), corresponding to the degree of certainty of the annotator for applying a given label to an incident
- **Text samples** from the incident report relevant to the assigned label, which ground each the classification to supporting text data
- **Free comments**, where the annotator may provide their rationale, evidence, sources and any information deemed relevant for assigning the label


## How do I annotate incidents with GMF?

The structure of GMF, paired with the AIID interfaces for [incident discovery](https://incidentdatabase.ai/apps/discover) and annotation editing [^1]<!-- and risk checklisting [^2] -->, exposes the user to multiple sources of useful data for efficient and informed incident annotation. 

For example, the user can retrieve similar incidents annotated by the community with respect to
existing classifications, e.g. regarding the goal of the AI system. Retrieved incidents expose past annotations and auxiliary metadata, such as exemplar text snippets, annotator rationale and related sourced materials of potential relevance. 

These supplemental data may counteract the lack of AI system implementation details in incident
 reports regarding methods, technologies and technical failure causes, allowing the application of
  fitting labels for the incident at hand.

[^1]: Found in the page for each incident, e.g. [AIID incident #72](https://incidentdatabase.ai/cite/72/)

A visualization of this flow of information for decision making given uncertainty, is illustrated in the proposed GMF annotation process diagram below:

![](/images/gmf/structure_simplified.png)

Additionally, an indicative application of this annotation process for the real-world [AIID incident #72](https://incidentdatabase.ai/cite/72/) is illustrated below.

![](/images/gmf/annotation.png)


## How do I explore the taxonomy?

All taxonomies can be used to filter incident reports within the 
[Discover Application](https://incidentdatabase.ai/apps/discover). The taxonomy filters work similarly to how 
you filter products on an e-commerce website. Use the search 
field at the bottom of the “Classifications” tab to find the 
taxonomy field you would like to filter with, then click the 
desired value to apply the filter.

## About the Responsible AI Collaborative

The AI Incident Database is a collaborative project of many 
people and organizations. Details on the people and organizations 
contributing to this particular taxonomy will appear here, while 
you can learn more about the Collab itself on the incident 
database [home](https://incidentdatabase.ai/) and 
[about](https://incidentdatabase.ai/about/) pages.

The maintainer(s) of this taxonomy include:
* [Nikiforos Pittaras](https://www.linkedin.com/in/nikiforos-pittaras/)

Contributor(s) to the taxonomy include:
* [Sean McGregor](https://www.linkedin.com/in/seanbmcgregor/)
