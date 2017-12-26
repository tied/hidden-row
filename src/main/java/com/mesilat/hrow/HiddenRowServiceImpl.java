package com.mesilat.hrow;

import com.atlassian.plugin.spring.scanner.annotation.export.ExportAsService;
import javax.inject.Named;

@ExportAsService({HiddenRowService.class})
@Named("com.mesilat:hidden-row:dummy-service")
public class HiddenRowServiceImpl implements HiddenRowService {
    // Dummy service for dependency only
}