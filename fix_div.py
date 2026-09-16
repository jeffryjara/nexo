import re

with open('src/components/NexoLab.jsx', 'r', encoding='utf-8') as f:
    nexo = f.read()

# Locate the end of the Pagination block. 
# It currently is:
#                                 </div>
#                             </div>
#                         </div>
#                         </div> (closing gap-8)
#                     </div> (closing max-w-6xl)
#                 </div> (closing min-h-screen)
#
# I need to insert ONE `</div>` right before `                        </div>\n                    </div>\n                </div>\n        \n\n            {clearTarget`
pattern = r'                        </div>\n                    </div>\n                </div>\n        \n\n            \{clearTarget && \('
replacement = r'                        </div>\n                        </div>\n                    </div>\n                </div>\n        \n\n            {clearTarget && ('

nexo = re.sub(pattern, replacement, nexo)

with open('src/components/NexoLab.jsx', 'w', encoding='utf-8') as f:
    f.write(nexo)
