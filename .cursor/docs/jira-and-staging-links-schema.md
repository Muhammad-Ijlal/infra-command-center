$JIRA-URL: link to jira ticket if branch name contain jira task number (ve- or VE-). Example: for branch `ve-1234/feature/test-stage-url-attached` value will be - https://volindo-software.atlassian.net/browse/VE-1234 

$JIRA-TICKET: Short code of Jira ticket. Example: VE-1234

$STAGING-PREFIX: staging prefix is last part of branch name (after last slash). Example: for branch `ve-1234/feature/test-stage-url-attached` value will be `test-stage-url-attached` 

$STAGING-URL: https://{$STAGING-PREFIX}.app.bookorp.com/. Example: if $STAGING-PREFIX is `test-stage-url-attached` value will be https://test-stage-url-attached.app.bookorp.com/

Example: 
Branch name: `ve-1234/feature/test-stage-url-attached`
$JIRA-URL: `https://volindo-software.atlassian.net/browse/VE-1234`
$JIRA-TICKET: `VE-1234`
$STAGING-PREFIX: `test-stage-url-attached`
$STAGING-URL:  https://test-stage-url-attached.app.bookorp.com/
