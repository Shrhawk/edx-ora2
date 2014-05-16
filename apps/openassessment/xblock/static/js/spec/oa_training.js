/**
Tests for OpenAssessment Student Training view.
**/

describe("OpenAssessment.StudentTrainingView", function() {

    // Stub server
    var StubServer = function() {
        var successPromise = $.Deferred(
            function(defer) { defer.resolve(); }
        ).promise();

        this.render = function(step) {
            return successPromise;
        };

        this.trainingAssess = function() {
            return successPromise;
        };
    };

    // Stub base view
    var StubBaseView = function() {
        this.showLoadError = function(msg) {};
        this.toggleActionError = function(msg, step) {};
        this.setUpCollapseExpand = function(sel) {};
        this.scrollToTop = function() {};
        this.loadAssessmentModules = function() {};
    };

    // Stubs
    var baseView = null;
    var server = null;

    // View under test
    var view = null;

    beforeEach(function() {
        // Load the DOM fixture
        jasmine.getFixtures().fixturesPath = 'base/fixtures';
        loadFixtures('oa_student_training.html');

        // Create a new stub server
        server = new StubServer();

        // Create the stub base view
        baseView = new StubBaseView();

        // Create the object under test
        var el = $("#openassessment-base").get(0);
        view = new OpenAssessment.StudentTrainingView(el, server, baseView);
        view.installHandlers();
    });

    it("submits an assessment for a training example", function() {
        spyOn(server, 'trainingAssess').andCallFake(function() {
            return $.Deferred(function(defer) {
                return {
                    "Criterion 1": "Good",
                    "Criterion 2": "Poor",
                    "Criterion 3": "Fair"
                };
            }).promise();
        });

        // Select rubric options
        var optionsSelected = {};
        optionsSelected['Criterion 1'] = 'Poor';
        optionsSelected['Criterion 2'] = 'Fair';
        optionsSelected['Criterion 3'] = 'Good';
        view.rubric.optionsSelected(optionsSelected);

        // Submit the assessment
        view.assess();

        // Expect that the assessment was sent to the server
        expect(server.trainingAssess).toHaveBeenCalledWith(optionsSelected);
    });

    it("disable the assess button when the user submits", function() {
        spyOn(server, 'trainingAssess').andCallFake(function() {
            return $.Deferred(function(defer) {
                return {
                    "Criterion 1": "Good",
                    "Criterion 2": "Poor",
                    "Criterion 3": "Fair"
                };
            }).promise();
        });

        // Initially, the button should be disabled
        expect(view.assessButtonEnabled()).toBe(false);

        // Select options and submit an assessment
        var optionsSelected = {};
        optionsSelected['Criterion 1'] = 'Poor';
        optionsSelected['Criterion 2'] = 'Fair';
        optionsSelected['Criterion 3'] = 'Good';
        view.rubric.optionsSelected(optionsSelected);

        // Enable the button (we do this manually to avoid dealing with async change handlers)
        view.assessButtonEnabled(true);

        // Submit the assessment
        view.assess();

        // The button should be disabled after submission
        expect(view.assessButtonEnabled()).toBe(false);
    });

    it("reloads the assessment steps when the user submits an assessment", function() {
        spyOn(baseView, 'loadAssessmentModules').andCallThrough();
        spyOn(server, 'trainingAssess').andCallFake(function() {
            return $.Deferred(function(defer){return {};}).promise();
        });

        // Select rubric options
        var optionsSelected = {};
        optionsSelected['Criterion 1'] = 'Poor';
        optionsSelected['Criterion 2'] = 'Fair';
        optionsSelected['Criterion 3'] = 'Good';
        view.rubric.optionsSelected(optionsSelected);

        // Submit the assessment
        view.assess();

        // Expect that the assessment was sent to the server
        expect(server.trainingAssess).toHaveBeenCalledWith(optionsSelected);

        // Expect that the steps were reloaded
        expect(baseView.loadAssessmentModules).toHaveBeenCalled();
    });
});
