covalic.views.ChallengesView = covalic.View.extend({
    initialize: function () {
        girder.cancelRestRequests('fetch');

        this.collection = new covalic.collections.ChallengeCollection();
        this.collection.on('g:changed', function () {
            this.render();
        }, this).fetch();

        this.paginateWidget = new girder.views.PaginateWidget({
            collection: this.collection,
            parentView: this
        });

        this.searchWidget = new girder.views.SearchFieldWidget({
            placeholder: 'Search challenges...',
            types: ['challenge_challenge'],
            getInfoCallback: function (type, obj) {
                if (type === 'challenge_challenge') {
                    return {
                        text: obj.name,
                        icon: 'flag-checkered'
                    };
                }
            },
            parentView: this
        }).on('g:resultClicked', this._gotoChallenge, this);
    },

    render: function () {
        this.$el.html(covalic.templates.challengeList({
            challenges: this.collection.models,
            admin: !!(girder.currentUser && girder.currentUser.get('admin')),
            girder: girder
        }));

        this.paginateWidget.setElement(this.$('.c-challenge-pagination')).render();
        this.searchWidget.setElement(this.$('.c-challenges-search-container')).render();

        this.$('.c-tooltip').tooltip({
            delay: 100,
            container: this.$el,
            placement: function (tip, el) {
                return $(el).attr('placement') || 'top';
            }
        });

        return this;
    },

    createDialog: function () {
        new covalic.views.EditChallengeWidget({
            el: $('#g-dialog-container'),
            parentView: this
        }).on('g:saved', function (challenge) {
            covalic.router.navigate('challenge/' + challenge.get('_id'), {
                trigger: true
            });
        }, this).render();
    },

    _gotoChallenge: function (challenge) {
        covalic.router.navigate('challenge/' + challenge.id, {trigger: true});
    }
});

covalic.router.route('challenges', 'challenges', function () {
    girder.events.trigger('g:navigateTo', covalic.views.ChallengesView);
});
