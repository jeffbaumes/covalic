covalic.views.ChallengePhasesView = covalic.View.extend({
    events: {
        'click a.c-phase-link': function (event) {
            var cid = $(event.currentTarget).attr('c-phase-cid');
            covalic.router.navigate('phase/' + this.collection.get(cid).id, {trigger: true});
        },
        'c:update-phase-ordinals .c-phase-list': function (event) {
            var collection = this.collection;
            $('li a.c-phase-link', $(event.currentTarget)).each(function (ordinal) {
                var cid = $(this).attr('c-phase-cid');
                var phase = collection.get(cid);
                if (phase.get('ordinal') !== ordinal) {
                    phase.set('ordinal', ordinal).save();
                }
            });
        }
    },

    initialize: function (settings) {
        girder.cancelRestRequests('fetch');
        this.collection = new covalic.collections.ChallengePhaseCollection();
        this.collection.on('g:changed', function () {
            this.render();
        }, this).fetch({
            challengeId: settings.challenge.get('_id')
        });
        this.challenge = settings.challenge;
    },

    render: function () {
        this.$el.html(covalic.templates.challengePhasesPage({
            phases: this.collection.models,
            challenge: this.challenge,
            canCreate: this.challenge.getAccessLevel() >= girder.AccessType.WRITE
        }));

        if (this.challenge.getAccessLevel() >= girder.AccessType.ADMIN) {
            $('.c-phase-list').sortable({
                placeholder: '<li class="c-phase-list-entry"><a class="c-phase-link">&nbsp;</a></li>'
            }).bind('sortstart', function (e, ui) {
                $('.c-phase-reorder', ui.item).tooltip('hide');
            }).bind('sortupdate', function (e, ui) {
                ui.item.trigger('c:update-phase-ordinals');
            });
        }

        this.$('.c-phase-reorder').tooltip({
            placement: 'left',
            delay: 200,
            container: this.$el,
            trigger: 'hover'
        });
        this.$('.c-tooltip').tooltip({
            delay: 100,
            container: this.$el
        });

        return this;
    }
});
