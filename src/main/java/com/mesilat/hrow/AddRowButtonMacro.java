package com.mesilat.hrow;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.confluence.renderer.template.TemplateRenderer;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.google.common.collect.Maps;
import java.util.Map;
import javax.inject.Inject;

@Scanned
public class AddRowButtonMacro implements Macro {
    private static final String PLUGIN_KEY = "com.mesilat.hidden-row";

    private final TemplateRenderer renderer;

    @Override
    public String execute(Map<String,String> parameters, String body, ConversionContext context) throws MacroExecutionException {
        Map<String, Object> renderMap = Maps.newHashMap();
        return renderFromSoy("resources", "Mesilat.HiddenRow.Templates.hiddenRowMacro.soy", renderMap);
    }

    @Override
    public BodyType getBodyType() {
        return BodyType.NONE;
    }

    @Override
    public OutputType getOutputType() {
        return OutputType.INLINE;
    }


    @Inject
    public AddRowButtonMacro(
        final @ComponentImport TemplateRenderer renderer
    ) {

        this.renderer = renderer;
    }

    public String renderFromSoy(String key, String soyTemplate, Map soyContext) {
        StringBuilder output = new StringBuilder();
        renderer.renderTo(output, String.format("%s:%s", PLUGIN_KEY, key), soyTemplate, soyContext);
        return output.toString();
    }
}