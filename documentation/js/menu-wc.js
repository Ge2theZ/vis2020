'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">vis2020 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' : 'data-target="#xs-components-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' :
                                            'id="xs-components-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BarGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BarGraphComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BreadcrumbComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoverCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoverCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoverCarouselComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoverCarouselComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FaqViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FaqViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GameDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GameDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GenreCarouselComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GenreCarouselComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GenrePublisherViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GenrePublisherViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GraphViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GraphViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainContentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PieChartComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PieChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PublisherCarouselComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PublisherCarouselComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadarChartComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadarChartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StackedLineGraphComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StackedLineGraphComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' : 'data-target="#xs-injectables-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' :
                                        'id="xs-injectables-links-module-AppModule-f739d3ef0f79ecd36d005d81c9b18a0e"' }>
                                        <li class="link">
                                            <a href="injectables/DataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoverCarousel.html" data-type="entity-link">CoverCarousel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Game.html" data-type="entity-link">Game</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenreSalesPerYear.html" data-type="entity-link">GenreSalesPerYear</a>
                            </li>
                            <li class="link">
                                <a href="classes/SharePerYearPerPublisher.html" data-type="entity-link">SharePerYearPerPublisher</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link">DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InteractionService.html" data-type="entity-link">InteractionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link">NavigationService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Breadcrumb.html" data-type="entity-link">Breadcrumb</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CoverCarouselStore.html" data-type="entity-link">CoverCarouselStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MarketShareForGenrePerYearStore.html" data-type="entity-link">MarketShareForGenrePerYearStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StaticCarousel.html" data-type="entity-link">StaticCarousel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});