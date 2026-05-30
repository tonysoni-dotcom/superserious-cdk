import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const agentSchedules = [
    { name: 'taco-nudge',     schedule: 'rate(15 minutes)' },
    { name: 'good-vibes',     schedule: 'rate(15 minutes)' },
    { name: 'mini-me',        schedule: 'rate(5 minutes)'  },
    { name: 'church-lady',    schedule: 'rate(15 minutes)' },
    { name: 'welcome-wagon',  schedule: 'rate(15 minutes)' },
    { name: 'matchmaker',     schedule: 'cron(0 8 * * ? *)' },
    { name: 'elephant',       schedule: 'cron(0 2 * * ? *)' },
];

export const createAgentSchedules = (scope, agentsLambda) => {
    agentSchedules.forEach(({ name, schedule }) => {
        const rule = new events.Rule(scope, `agent-schedule-${name}`, {
            ruleName: `v1x-agent-${name}`,
            schedule: events.Schedule.expression(schedule),
        });

        rule.addTarget(new targets.LambdaFunction(agentsLambda, {
            event: events.RuleTargetInput.fromObject({ agent: name }),
        }));
    });
};
